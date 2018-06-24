const mongoose = require('mongoose');

const streamSchema = new mongoose.Schema(
  {
    id: { auto: true, type: mongoose.Schema.Types.ObjectId },
    userId: String,
    videoId: String,
    transientLink: String,
    createdAt: String,
  },
  {
    versionKey: false,
  },
);

module.exports = mongoose.model('stream', streamSchema);
