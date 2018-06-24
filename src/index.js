const { send } = require('micro');
const { router, get, del } = require('microrouter');
const getVideos = require('./controllers/getVideos');
const connect = require('./db');

connect();

module.exports = router(
  get('/videos', async (req, res) => {
    send(res, 200, await getVideos());
  }),
  get('/streams', async (req, res) => {
    send(res, 200, []);
  }),
  // get('/streams/video/videoId:', async (req, res) => {
  //   send(res, 200, []);
  // }),
  // del('/streams/:streamId', async (req, res) => {
  //   send(res, 200, []);
  // }),
);
