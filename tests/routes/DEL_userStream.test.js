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
  id: ObjectId(`1234567890a${n}`).toHexString(),
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

test('DEL /streams/:id without Auth token', async t => {
  let res;
  let error;
  try {
    res = await got.delete(`${url}/streams/1234`, { json: true });
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

test('DEL /streams/:id with Auth token', async t => {
  let res;
  let error;
  const streamIdToDelete = rawStreamData[0].id;
  try {
    res = await got.delete(`${url}/streams/${streamIdToDelete}`, {
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
  t.not(res.body, undefined);
  t.is(res.body.id, streamIdToDelete);

  // try accessing it again
  try {
    res = await got(`${url}/streams/${streamIdToDelete}`, {
      json: true,
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (err) {
    error = err;
  }
  t.is(error.statusCode, 404);
  t.is(error.statusMessage, 'Not Found');
});
