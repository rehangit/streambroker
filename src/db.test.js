const mongoose = require('mongoose');
const test = require('ava');

const dbConnect = require('./db');

test('db connects', async t => {
  const dbName = 'streamserver-test';
  dbConnect(`mongodb://localhost:27017/${dbName}`);
  t.is(mongoose.connection.name, dbName);
});
