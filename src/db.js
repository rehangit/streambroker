const mongoose = require('mongoose');

let instance = null;
const connectWithDB = async (url = process.env.MONGO_URL) => {
  if (!url) {
    throw new Error('MONGO_URL is undefined');
  }
  if (instance && instance.url !== url) {
    instance = null;
  }
  if (!instance || !instance.connection) {
    instance = await mongoose.connect(url);
    instance.url = url;
  }
  return instance.connection;
};

module.exports = connectWithDB;
