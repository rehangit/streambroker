const { router, get } = require('microrouter');
const getVideos = require('./controllers/getVideos');

module.exports = router(get('/videos', getVideos));
