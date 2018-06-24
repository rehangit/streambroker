const test = require('ava');
const micro = require('micro');
const listen = require('test-listen');
const got = require('got');
const db = require('../src/db');
const VideoModel = require('../src/models/video');

const app = require('../src/index.js');

const rawVideoData = [1, 2, 3, 4, 5].map(n => ({
  name: `video ${n}`,
  length: n * 20,
  confidentialLink: `https://conf.com/${n * 10}`,
}));

test.before(async () => {
  await db();
  await VideoModel.remove();
  await VideoModel.create(rawVideoData);
});

test('GET /videos', async t => {
  const service = micro(app);
  const url = await listen(service);
  const res = await got(`${url}/videos`, { json: true });
  const videos = res.body;
  t.true(videos instanceof Array);
  t.is(videos.length, rawVideoData.length);
  t.deepEqual(videos.map(v => v.name), rawVideoData.map(d => d.name));
});
