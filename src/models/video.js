const { Schema, model } = require('mongoose');

const videoSchema = new Schema({
  id: String,
  name: String,
  confidentialLink: String,
  length: Number, // milli seconds
});

module.exports = model('video', videoSchema);
