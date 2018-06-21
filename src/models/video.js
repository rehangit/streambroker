/* eslint-disable no-underscore-dangle, no-param-reassign */
const mongoose = require('mongoose');

const cleaned = (d, r) => {
  r.id = r._id;
  delete r._id;
  delete r.__v;
};

const videoSchema = new mongoose.Schema(
  {
    name: String,
    length: Number, // milli seconds
    confidentialLink: { type: String, select: false },
  },
  {
    //    toJSON: { transform: cleaned },
    toObject: { transform: cleaned },
  },
);

module.exports = mongoose.model('video', videoSchema);
