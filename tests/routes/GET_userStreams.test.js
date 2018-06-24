const test = require('ava');
const micro = require('micro');
const listen = require('test-listen');
const got = require('got');
const jwt = require('jsonwebtoken');
const {
  Types: { ObjectId },
} = require('mongoose');

const StreamModel = require('../../src/models/stream');
const app = require('../../src');

const rawStreamData = [1, 2, 3, 4, 5].map(n => ({
  userId: n <= 3 ? 'user_xyz' : 'someonelese',
  videoId: `video_id_${n}`,
  transientLink: `http://www.streamprovider.com/randomlink${n}`,
  createdAt: new Date().toISOString(),
}));

const token = jwt.sign({ sub: 'user_xyz' }, 'secret123');
let url;

test.before(async () => {
  const service = micro(app);
  url = await listen(service);
  await StreamModel.remove({});
  await StreamModel.create(rawStreamData);
});

test('GET /streams without Auth token', async t => {
  let res;
  let error;
  try {
    res = await got(`${url}/streams`, { json: true });
  } catch (err) {
    error = err;
  }
  t.not(error, undefined);
  t.true(
    error.message.includes('StreamBroker Error: Missing authentication token'),
  );
  t.is(error.statusCode, 401);
  t.is(error.statusMessage, 'Unauthorized');
  t.is(res, undefined);
});

test('GET /streams with Auth token', async t => {
  let res;
  let error;

  try {
    res = await got(`${url}/streams`, {
      json: true,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (err) {
    error = err;
  }

  t.is(error, undefined);
  t.not(res, undefined);
  t.is(res.statusCode, 200);
  t.true(res.body instanceof Array);
  const xyzStreams = rawStreamData.filter(d => d.userId === 'user_xyz');
  t.is(res.body.length, xyzStreams.length);

  const sortedResult = res.body
    .map(d => {
      delete d.id; // eslint-disable-line no-param-reassign
      return d;
    })
    .sort((a, b) => (a.videoId < b.videoId ? -1 : 1));
  t.deepEqual(sortedResult, xyzStreams);
});

test('GET single existing /streams/:id with Auth token', async t => {
  let res;
  let error;
  const presetId = ObjectId('1234567890ab').toHexString();

  try {
    await StreamModel.create({
      id: presetId,
      userId: 'user_xyz',
      videoId: `preset_streamid_videoid`,
      transientLink: `http://www.streamprovider.com/randomlink/preset`,
      createdAt: new Date().toISOString(),
    });

    res = await got(`${url}/streams/${presetId}`, {
      json: true,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (err) {
    error = err;
  }

  t.is(error, undefined);
  t.not(res.body, undefined);
  t.is(res.statusCode, 200);
  t.true(res.body instanceof Object);
  t.is(res.body.id, presetId);
});

test('GET single non-existing /streams/:id with Auth token', async t => {
  let error;
  const nonExistingId = ObjectId('abababababab').toHexString();

  try {
    await got(`${url}/streams/${nonExistingId}`, {
      json: true,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (err) {
    error = err;
  }

  t.not(error, undefined);
  t.is(error.statusCode, 404);
  t.true(error.statusMessage.includes('Not Found'));
});
