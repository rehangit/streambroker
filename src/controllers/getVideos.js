const VideoModel = require('../models/video');

module.exports = async () =>
  VideoModel.find({})
    .lean()
    .exec();
