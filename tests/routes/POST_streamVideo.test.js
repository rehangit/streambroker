const test = require('ava');
const micro = require('micro');
const listen = require('test-listen');
const got = require('got');
const jwt = require('jsonwebtoken');
const {
  Types: { ObjectId },
} = require('mongoose');

const StreamModel = require('../../src/models/stream');
const VideoModel = require('../../src/models/video');

const app = require('../../src');

const rawVideoData = [1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => ({
  id: ObjectId(`1234567890a${n}`).toHexString(),
  name: `video ${n}`,
  length: n * 20,
  confidentialLink: `https://conf.com/${n * 10}`,
}));

const token = jwt.sign({ sub: 'user_xyz' }, 'secret123');
const options = {
  json: true,
  headers: { Authorization: `Bearer ${token}` },
};

let url;

test.before(async () => {
  const service = micro(app);
  url = await listen(service);
  await StreamModel.remove({});
  await VideoModel.remove({});
  await VideoModel.create(rawVideoData);
});

// POST /streams/video/:videoId without Auth token
test('Should not be able to play a video without being logged in', async t => {
  let error;
  try {
    await got.post(`${url}/streams/video/12345`, { json: true });
  } catch (err) {
    error = err;
  }
  t.not(error, undefined);
  t.true(
    error.message.includes('StreamBroker Error: Missing authentication token'),
  );
  t.is(error.statusCode, 401);
  t.is(error.statusMessage, 'Unauthorized');
});

// POST /streams/video/:videoId with Auth token
test('Should be able to play a video after login', async t => {
  let res;
  let error;

  const videoIdToStream = rawVideoData[0].id;
  try {
    res = await got.post(`${url}/streams/video/${videoIdToStream}`, {
      json: true,
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (err) {
    error = err;
  }

  const stream = res.body;
  t.is(error, undefined);
  t.is(res.statusCode, 200);
  t.is(stream.userId, 'user_xyz');
  t.is(stream.videoId, rawVideoData[0].id);
  t.is(stream.transientLink, rawVideoData[0].confidentialLink);

  try {
    res = await got(`${url}/streams`, {
      json: true,
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (err) {
    error = err;
  }

  t.is(res.statusCode, 200);

  const userStreams = res.body;
  t.true(userStreams instanceof Array);
  t.is(userStreams.length, 1);
  t.is(userStreams[0].videoId, videoIdToStream);
  t.is(userStreams[0].userId, 'user_xyz');
  t.is(userStreams[0].transientLink, rawVideoData[0].confidentialLink);
});

test('Should not be able to play fourth video', async t => {
  let result;
  let error;

  // play first three videos
  const videoIdsToStream = rawVideoData.slice(0, 3).map(v => v.id);
  try {
    result = await Promise.all(
      videoIdsToStream.map(async id => {
        const res = await got.post(`${url}/streams/video/${id}`, options);
        return res.statusCode;
      }),
    );
  } catch (err) {
    error = err;
  }

  // should all succeed
  t.is(error, undefined);
  t.deepEqual(result, [200, 200, 200]);

  // Playing 4th video concurrently should fail
  try {
    result = await got.post(
      `${url}/streams/video/${rawVideoData[3].id}`,
      options,
    );
  } catch (err) {
    error = err;
  }

  t.not(error, undefined);
  t.is(error.statusCode, 403); // Forbidden
});

test('Should be able to play another if one of three finished/removed', async t => {
  let result;
  let error;

  const videoIdsToStream = rawVideoData.slice(0, 2).map(v => v.id);
  try {
    // play first three videos
    await Promise.all(
      videoIdsToStream.map(id =>
        got.post(`${url}/streams/video/${id}`, options),
      ),
    );

    // get curently playing streams
    const playingStreams = (await got(`${url}/streams`, options)).body;

    // delete one of them
    await got.delete(`${url}/streams/${playingStreams[0].id}`, options);

    // now try to stream another video
    result = await got.post(
      `${url}/streams/video/${rawVideoData[3].id}`,
      options,
    );
  } catch (err) {
    error = err;
  }

  // should succeed
  t.is(error, undefined);
  t.is(result.statusCode, 200);
  t.is(result.body.videoId, rawVideoData[3].id);
  t.is(result.body.transientLink, rawVideoData[3].confidentialLink);
});
