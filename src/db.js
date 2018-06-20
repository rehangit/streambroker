const mongoose = require('mongoose');

const connectWithDB = (url = process.env.MONGO_URL) => {
  mongoose.connect(url);
};

module.exports = connectWithDB;
