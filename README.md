# tracking-location-socketio
Broadcast/Tracking location for socketIO

### [Live Demo](http://trackinglocation.skylab.vn)

## Installation

You must have node installed: [Install NodeJS](https://nodejs.org/en/download/).

Clone repository and change directory to it

``` 
git clone https://github.com/viettranx/tracking-location-socketio.git 
cd tracking-location-socketio
```

Install nodemon
```
npm install -g nodemon
```

Install all dependencies needed
```
npm install
```

## Run
This project use nodemon to run and watch file changes. The command is:
```
nodemon Server.js
```

In case use need to run it as background service. Install forever and run with this:

```
npm install -g forever
forever start -c nodemon Server.js
```

Open your favorite browser and go to:

```
http://localhost:4333/
```

## Configruation
You can find default config in `nodemon.json`. That just simple:
```
{
  "env" : {
    "RUN_MODE"    : "dev",
    "PORT"        : 4333
  }
}
```
Since the nodemon service could not be watch itself config, you need to restart it.

## Want to add more route
This project use GPX format to emit location info to the clients. Just place any file GPX to `gpx` folder to add more. To create a GPX file, please follow the instruction at https://mapstogpx.com

## To Do

- [X] Parse XML content from GPX file.
- [X] Use SocketIO to emit to client
- [X] Client demo with website.
- [ ] Client demo with React Native.
- [ ] Client demo with iOS Native: Swift
- [ ] Client demo with Android Native: Kotlin

## Liccense
Feel free to use and pull request to contribute it as you want.
