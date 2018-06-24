const StreamModel = require('../models/stream');

module.exports = async userId =>
  StreamModel.find({ userId })
    .select('-_id')
    .lean()
    .exec();
