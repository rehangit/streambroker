const test = require('ava');

const connect = require('../db');
const Video = require('./video');

const props = {
  name: 'video name',
  length: 100,
  confidentialLink: 'http://www.link.com',
};
let video;

test.before(async () => {
  await connect();
  video = await new Video(props).exec();
});

test.beforeEach(async () => {
  await Video.remove({});
  await video.save();
});

test('model name is video', async t => {
  t.is(Video.modelName, 'video');
});

test('Video has schema properties', async t => {
  t.not(video.id, undefined);
  t.is(typeof video.id, 'string');
  t.true(video.id.length > 1);
  t.is(video.name, props.name);
  t.is(video.length, props.length);
  t.is(video.confidentialLink, props.confidentialLink);
});

test('returns only selected properties', async t => {
  const found = await Video.findOne({});
  console.log({ found });
  t.not(found, undefined);
  t.not(found, null);
  t.is(found.name, props.name);
  t.is(found.length, props.length);

  t.is(found.confidentialLink, undefined);
});

test('exposes hidden properties when selected', async t => {
  const found = await Video.findOne({}).select('+confidentialLink');
  t.is(found.confidentialLink, props.confidentialLink);
});
