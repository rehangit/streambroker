const test = require('ava');

const connect = require('../../src/db');
const StreamModel = require('../../src/models/stream');

const getUserStreams = require('../../src/controllers/getUserStreams');

const data = [
  {
    userId: 'user_xyz',
    videoId: 'video_id_1',
    transientLink: 'http://www.streamprovider.com/randomlink1',
    createdAt: new Date().toISOString(),
  },
  {
    userId: 'user_xyz',
    videoId: 'video_id_2',
    transientLink: 'http://www.streamprovider.com/randomlink2',
    createdAt: new Date().toISOString(),
  },
  {
    userId: 'user_unknown',
    videoId: 'video_id_3',
    transientLink: 'http://www.streamprovider.com/randomlink3',
    createdAt: new Date().toISOString(),
  },
];

test.before(async () => {
  await connect();
  await StreamModel.remove({});
  await new StreamModel(data).save();
});

test('gets user streams', async t => {
  const streams = await getUserStreams('user_xyz');
  t.true(streams instanceof Array);
  const xyzStreams = data.filter(s => s.userId === 'user_xyz');
  t.is(streams.length, xyzStreams.length);
});

test('exposes only public fields', async t => {
  const aStream = (await getUserStreams('user_xyz'))[0];
  // has correct userId
  t.not(aStream.id, undefined);
  t.is(aStream._id, undefined); // eslint-disable-line no-underscore-dangle
  t.is(aStream.__v, undefined); // eslint-disable-line no-underscore-dangle
  t.not(aStream.userId, undefined);
  t.not(aStream.transientLink, undefined);
  t.not(aStream.createdAt, undefined);
});
