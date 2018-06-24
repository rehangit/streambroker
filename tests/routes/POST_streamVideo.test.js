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
let url;

test.before(async () => {
  const service = micro(app);
  url = await listen(service);
  await StreamModel.remove({});
  await VideoModel.remove({});
  await VideoModel.create(rawVideoData);
});

test('POST /streams/video/:videoId without Auth token', async t => {
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

test.only('POST /streams/video/:videoId with Auth token', async t => {
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
});
