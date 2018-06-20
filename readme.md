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

This microservice is also deployable on heroku

## Implementation Details

### Interface
```
/videos 
  GET (public) - lists all available videos to stream

/streams
  GET (user) - lists videoIds for all active video streams being played by the user 
  
/streams/:videoId
  GET (user) - generates and returns the short lived stream url for the video associated with videoId. This stream is counted towards the active video streams being watched by the user until manually removed or expires

/streams/:videoId 
  DELETE (user) - removes videoId from the active list of streaming videos for user

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
};

```

## License

MIT © Rehan Ahmad
