const test = require('ava');

const dbConnect = require('../src/db');

test('MONGO_URL is defined', t => {
  t.not(process.env.MONGO_URL, '');
  t.true(process.env.MONGO_URL.includes('mongodb://'));
});

test('db connects', async t => {
  const dbName = process.env.MONGO_URL.split('/').slice(-1)[0];
  const conn = await dbConnect();
  t.is(conn.name, dbName);
});
