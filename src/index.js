const { json } = require('micro');
const router = require('microrouter');
const Video = require('./models/video');

module.exports = async req => {
  const videos = Video.find({}).select('id name length');
  // let's echo the text
  return videos;
};
