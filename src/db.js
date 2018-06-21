const mongoose = require('mongoose');

const connectWithDB = async (url = process.env.MONGO_URL) => {
  const self = await mongoose.connect(url);
  return self.connection;
};

module.exports = connectWithDB;
