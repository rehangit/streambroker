const test = require('ava');
const {
  Types: { ObjectId },
} = require('mongoose');

const connect = require('../../src/db');
const StreamModel = require('../../src/models/stream');

const delUserStream = require('../../src/controllers/delUserStream');

const data = [
  {
    id: ObjectId('111111111111').toHexString(),
    userId: 'user_xyz',
    videoId: 'video_id_1',
    transientLink: 'http://www.streamprovider.com/randomlink1',
    createdAt: new Date().toISOString(),
  },
  {
    id: ObjectId('222222222222').toHexString(),
    userId: 'user_xyz',
    videoId: 'video_id_2',
    transientLink: 'http://www.streamprovider.com/randomlink2',
    createdAt: new Date().toISOString(),
  },
  {
    id: ObjectId('333333333333').toHexString(),
    userId: 'user_different',
    videoId: 'video_id_3',
    transientLink: 'http://www.streamprovider.com/randomlink3',
    createdAt: new Date().toISOString(),
  },
];

test.before(async () => {
  await connect();
  await StreamModel.remove({});
  await StreamModel.create(data);
});

test('deletes a user stream identified by stream id', async t => {
  const deletedStream = await delUserStream('user_xyz', data[0].id);
  t.is(deletedStream.id.toHexString(), data[0].id);
  const dbResult = await StreamModel.findById(data[0].id);
  t.is(dbResult, null);
});
