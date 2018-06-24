const VideoModel = require('../models/video');

module.exports = async () =>
  VideoModel.find({})
    .select('-_id')
    .lean()
    .exec();
