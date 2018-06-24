const test = require('ava');

const connect = require('../../src/db');
const StreamModel = require('../../src/models/stream');

const props = {
  userId: 'user_xyz',
  videoId: 'video_id_123',
  transientLink: 'http://www.streamprovider.com/randomlink',
  createdAt: new Date().toISOString(),
};

let stream;

test.before(async () => {
  await connect();
});

test.beforeEach(async () => {
  await StreamModel.remove({});
  stream = await new StreamModel(props);
  await stream.save();
});

test('model name is stream', async t => {
  t.is(StreamModel.modelName, 'stream');
});

test('Stream has schema properties', async t => {
  t.not(stream.id, undefined);
  t.is(stream.userId, props.userId);
  t.is(stream.videoId, props.videoId);
  t.is(stream.transientLink, props.transientLink);
  t.is(stream.createdAt, props.createdAt);
});
