# streambroker [![Build Status](https://travis-ci.org/rehangit/streambroker.svg?branch=master)](https://travis-ci.org/rehangit/streambroker)

> Stream Broker

## Description

This micro service implments business rules for a video stream server.

This service checks how many video streams a given user is watching
and prevents a user watching more than 3 video streams concurrently.

This service does not implement any UI as such. It provides backend support for following functions for the accompanying UI:

* provides a list of available video streams for a user
* maintains a list of video streams being actively played by a user 
  * start stream
  * stop stream
* possibly expire an active stream after duration of the stream

## Usage

```bash
$ git clone rehangit/streambroker.git
$ cd streambroker
$ npm start
```

## Deployment

### now

This microservice can be deployed to [now](https://zeit.co/now) by Zeit.
Assuming you've got `now` installed and set up:

```bash
$ now rehangit/streambroker
```

Alternative, deploy right now without even leaving the browser:

[![Deploy to now](https://deploy.now.sh/static/button.svg)](https://deploy.now.sh/?repo=https://github.com/rehangit/streambroker)

### heroku

This microservice is also deployable on heroku using the config included.

## Implementation Details

### 

### Interface
```
/videos 
  GET (public) - lists all available videos to stream

/streams
  GET (user) - lists videoIds for all active video streams being played by the user 
  
/streams/video/:videoId
  POST (user) - generates and returns the short lived stream url for the video associated with videoId. This stream is counted towards the active video streams being watched by the user until manually removed or expires

/streams/:streamId 
  DELETE (user) - removes streamId from the current list of streams for user

```

### Data Modelling

The service maintains database of following models

```
video {
  id,
  name,
  confidentialLink
};

stream {
  id,
  userId,
  videoId,      
  transientLink,
  createdAt,
};

```

### Token

Only signed users can access the user API except `GET /video` which is public.
A signed user is one with JWT Bearer token that is signed with a secret (default: `secret123`). The following info is expected in the token:

Header: `{
 "typ": "JWT",
 "alg": "HS256"
}`

Payload: `{
 "sub": "user_id",
 "iat": "timestamp"
}` 

(e.g. `{
 "sub": "user_xyz",
 "iat": 1529888559
}`)

### Transient Link Strategy

When a stream is created for a signed in user against a videoId, a `transientLink` is generated to play the video. This link is mapped to the `confidentialLink` of the video which is normally not directly accessible. 

Current raw implementation exposes the `video.confidentialLink` directly in the `stream.transientLink`, however a future improvement can be implmented to issue a short lived signed JWT token containing the videoId or the video confidential link. In this scenario when the user would request to play the stream the token could be decoded and played if still valid. Otherwise the stream would be considered to have expired and would be removed from the user's current list of playing streams.




## License

MIT © Rehan Ahmad
