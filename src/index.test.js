const listen = require('test-listen');
const micro = require('micro');
const test = require('ava');
const got = require('got');

const app = require('.'); // eslint-disable-line import/order

test('echo back the text', async t => {
  const service = micro(app);
  const url = await listen(service);

  const res = await got(url, {
    json: true,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ text: 'Hello!' }),
  });

  // t.is(res.body.text, 'Hello!');
});
