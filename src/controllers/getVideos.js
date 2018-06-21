const Video = require('../models/video');

module.exports = async () =>
  Video.find()
    .lean()
    .exec();
