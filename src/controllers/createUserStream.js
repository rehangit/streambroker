const VideoModel = require('../models/video');
const StreamModel = require('../models/stream');
const createTransientLink = require('../core/createTransientLink');

const maxAllowed = process.env.MAX_CONCURRENT_STREAMS || 3;

module.exports = async (userId, videoId) => {
  const currentStreams = await StreamModel.find({ userId });
  const found = currentStreams.find(s => s.videoId === videoId);
  if (found) return found; // already playing so can replay

  if (currentStreams.length >= maxAllowed) return null;

  const video = await VideoModel.findOne({ id: videoId })
    .select('-_id +confidentialLink')
    .lean()
    .exec();

  currentStreams.filter(s => s.videoId !== videoId);

  return StreamModel.create({
    userId,
    videoId,
    transientLink: createTransientLink(video),
    createdAt: new Date().toISOString(),
  });
};
