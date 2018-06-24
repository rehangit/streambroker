const test = require('ava');

const connect = require('../../src/db');
const VideoModel = require('../../src/models/video');

const getVideos = require('../../src/controllers/getVideos');

const data = {
  name: 'test video',
  length: 12000,
  confidentialLink: 'http://www.link.com',
};

test.before(async () => {
  await connect();
  await VideoModel.remove({});
  await new VideoModel(data).save();
});

test('gets videos', async t => {
  const videos = await getVideos();
  t.true(videos instanceof Array);
  t.is(videos.length, 1);
});

test('exposes only public fields', async t => {
  const video = (await getVideos())[0];
  // has correct name
  t.is(video.name, data.name);

  t.not(video.id, undefined);
  t.is(video._id, undefined); // eslint-disable-line no-underscore-dangle
  t.is(video.__v, undefined); // eslint-disable-line no-underscore-dangle
  t.is(video.confidentialLink, undefined);
});
