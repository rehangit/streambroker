const mongoose = require('mongoose');

let instance = null;
const connectWithDB = async (url = process.env.MONGO_URL) => {
  if (!instance || !instance.connection) {
    instance = await mongoose.connect(url);
  }
  return instance.connection;
};

module.exports = connectWithDB;
