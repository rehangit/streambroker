const mongoose = require('mongoose');
const test = require('ava');

const dbConnect = require('./db');

test('MONGO_URL is defined', t => {
  t.not(process.env.MONGO_URL, '');
  t.true(process.env.MONGO_URL.includes('mongodb://'));
});

test('db connects', async t => {
  const dbName = process.env.MONGO_URL.split('/').slice(-1)[0];
  await dbConnect();
  t.is(mongoose.connection.name, dbName);
});
