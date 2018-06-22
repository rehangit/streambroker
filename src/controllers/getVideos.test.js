const test = require('ava');

const connect = require('../db');
const VideoModel = require('../models/video');

const getVideos = require('./getVideos');

test.before(async () => {
  await connect();
  await VideoModel.remove();
  const video = new VideoModel({
    name: 'test video',
    length: 12000,
    confidentialLink: 'http://www.link.com',
  });
  await video.save();
});

test('gets videos', async t => {
  const videos = await getVideos();

  t.is(videos.length, 1);
  t.is(videos[0].name, 'test video');
  t.is(videos[0].confidentialLink, undefined);
});
