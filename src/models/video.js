const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema(
  {
    id: { auto: true, type: mongoose.Schema.Types.ObjectId },
    name: String,
    length: Number, // milli seconds
    confidentialLink: { type: String, select: false },
  },
  {
    versionKey: false,
  },
);

module.exports = mongoose.model('video', videoSchema);
