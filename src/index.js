const { send } = require('micro');
const { router, get, post } = require('microrouter');
const getVideos = require('./controllers/getVideos');

module.exports = router(
  get('/videos', async (req, res) => {
    send(res, 200, await getVideos());
  }),
  get('/streams/videoId:', async (req, res) => {
    send(res, 200, []);
  }),
  post('/streams/:streamId', async (req, res) => {
    send(res, 200, []);
  }),
  get('/streams', async (req, res) => {
    send(res, 200, []);
  }),
);
