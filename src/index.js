const { send } = require('micro');
const { router, get } = require('microrouter');
const getVideos = require('./controllers/getVideos');
const connect = require('./db');

connect();

module.exports = router(
  get('/videos', async (req, res) => {
    const videos = await getVideos();
    send(res, 200, videos);
  }),
);
