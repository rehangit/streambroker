const { send } = require('micro');
const { router, get, del } = require('microrouter');
const jwtAuth = require('micro-jwt-auth')(
  process.env.JWT_SECRET || 'secret123',
  {
    resAuthInvalid: 'StreamBroker Error: Invalid authentication token',
    resAuthMissing: 'StreamBroker Error: Missing authentication token',
  },
);

const getVideos = require('./controllers/getVideos');
const getUserStreams = require('./controllers/getUserStreams');
const delUserStream = require('./controllers/delUserStream');

const connect = require('./db');

connect();

module.exports = router(
  get('/videos', async (req, res) => {
    send(res, 200, await getVideos());
  }),
  get(
    '/streams',
    jwtAuth(async (req, res) => {
      const userId = req.jwt.sub;
      send(res, 200, await getUserStreams(userId));
    }),
  ),
  get(
    '/streams/:id',
    jwtAuth(async (req, res) => {
      const userId = req.jwt.sub;
      const streamId = req.params.id;
      const streams = await getUserStreams(userId, streamId);
      if (streams && streams.length) send(res, 200, streams[0]);
      else send(res, 404);
    }),
  ),
  // get('/streams/video/videoId:', async (req, res) => {
  //   send(res, 200, []);
  // }),
  del(
    '/streams/:streamId',
    jwtAuth(async (req, res) => {
      const userId = req.jwt.sub;
      const streamId = req.params.streamId; // eslint-disable-line prefer-destructuring
      send(res, 200, await delUserStream(userId, streamId));
    }),
  ),
);
