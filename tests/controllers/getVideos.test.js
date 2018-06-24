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
  const video = new VideoModel(data);
  await video.save();
});

test('gets videos', async t => {
  const videos = await getVideos();

  t.is(videos.length, 1);
  t.is(videos[0].name, data.name);
  t.is(videos[0].confidentialLink, undefined);
});
