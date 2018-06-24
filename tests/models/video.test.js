const test = require('ava');

const connect = require('../../src/db');
const VideoModel = require('../../src/models/video');

const props = {
  name: 'video name',
  length: 100,
  confidentialLink: 'http://www.link.com',
};
let video;

test.before(async () => {
  await connect();
});

test.beforeEach(async () => {
  await VideoModel.remove({});
  video = await new VideoModel(props);
  await video.save();
});

test('model name is video', async t => {
  t.is(VideoModel.modelName, 'video');
});

test('Video has schema properties', async t => {
  t.not(video.id, undefined);
  t.is(video.name, props.name);
  t.is(video.length, props.length);
  t.is(video.confidentialLink, props.confidentialLink);
});

test('hides confidentialLink in results', async t => {
  const found = await VideoModel.findOne({});
  t.not(found, undefined);
  t.is(found.name, props.name);
  t.is(found.length, props.length);
  // ensure hidden property is not returned
  t.is(found.confidentialLink, undefined);
});

test('allows explicit access to confidentialLink', async t => {
  const found = await VideoModel.findOne({}).select('+confidentialLink');
  t.is(found.name, props.name);
  t.is(found.confidentialLink, props.confidentialLink);
});
