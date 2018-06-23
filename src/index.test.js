const listen = require('test-listen');
const micro = require('micro');
const test = require('ava');
const got = require('got');
const connect = require('./db');
const Video = require('./models/video');

const app = require('.');

const videoProps = arg => ({
  name: `test video${arg}`,
  length: 12000 + arg,
  confidentialLink: `http://www.link.com/${arg}`,
});

test.before(async () => {
  await connect();
  await Video.remove({});
  await [1, 2, 3, 4].map(n => new Video(videoProps(n)).save());
});

test('GET /videos', async t => {
  const service = micro(app);
  const url = await listen(service);
  const res = await got(`${url}/videos`);

  t.is(typeof res.body, 'string'); // JSON.strigified
  const records = JSON.parse(res.body);
  console.log(records);
  t.true(records instanceof Array);
  t.is(records.length, 4);
});
