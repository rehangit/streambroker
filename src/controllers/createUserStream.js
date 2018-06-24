const VideoModel = require('../models/video');
const StreamModel = require('../models/stream');
const createTransientLink = require('../core/createTransientLink');

module.exports = async (userId, videoId) => {
  const video = await VideoModel.findOne({ id: videoId })
    .select('-_id +confidentialLink')
    .lean()
    .exec();

  return StreamModel.create({
    userId,
    videoId,
    transientLink: createTransientLink(video),
    createdAt: new Date().toISOString(),
  });
};
