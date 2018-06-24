const StreamModel = require('../models/stream');

module.exports = async (userId, id) =>
  StreamModel.findOneAndRemove({ id, userId })
    .select('-_id')
    .lean()
    .exec();
