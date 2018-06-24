const {
  Types: { ObjectId },
} = require('mongoose');
const StreamModel = require('../models/stream');

module.exports = async (userId, id) =>
  StreamModel.find(id ? { id, userId } : { userId })
    .select('-_id')
    .lean()
    .exec();
