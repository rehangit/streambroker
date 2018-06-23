const Video = require('../models/video');

module.exports = async () =>
  Video.find({ virtuals: true })
    .lean()
    .exec((err, docs) => {
      if (err) throw err;
      return docs.map(doc => doc.toJSON());
    });
