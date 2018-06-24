const jwt = require('jsonwebtoken');
const VideoModel = require('../models/video');

module.exports = video => video.confidentialLink;
