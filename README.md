# tracking-location-socketio
This project helps us show a demo app view all vehicles are moving on the maps. It's useful to make a prototype app like Uber/Grab.

It's not real tracking GPS. I use GPX files exported from Google Direction service to make a fake tracking engine and socketIO to emit data to the clients. Hope you enjoy it :D

### [Live Demo for Website](http://trackinglocation.skylab.vn)

## On React Native: iOS & Android
![](https://www.dropbox.com/s/ioj9m7xh7k66e0y/demo_react_native.gif?raw=1)

## Installation

You must have node installed: [Install NodeJS](https://nodejs.org/en/download/).

Clone repository and change directory to it

``` 
git clone https://github.com/viettranx/tracking-location-socketio.git 
cd tracking-location-socketio/server
```

Install nodemon
```
npm install -g nodemon
```

Install all dependencies needed
```
npm install
```

## Run the server
This project needs nodemon to run and watch file changes. The command is:
```
nodemon Server.js
```

In case we need to run it as background service. Install forever and run:

```
npm install -g forever
forever start -c nodemon Server.js
```

Open your favorite browser and go to:

```
http://localhost:4333/
```

## Configruation
You can find default config in `nodemon.json`. That's just simple:
```
{
  "env" : {
    "RUN_MODE"    : "dev",
    "PORT"        : 4333
  }
}
```
Since the nodemon service could not watch itself config, you need to restart it.

## Want to add more route
This project uses GPX format to emit location info to the clients. Just place any file GPX to `gpx` folder to add more. To create a GPX file, you can use Google Maps Direction service and export it with a shorten URL:

![](https://www.dropbox.com/s/9uf87hwnc3faoof/mapsDirection.png?raw=1)

Then paste the URL to https://mapstogpx.com/pokemon.php to generate GPX file

![](https://www.dropbox.com/s/xfe6b44ccblo64k/mapstopgx.png?raw=1)

## Run React Native
You need react-native installed: [React Native](https://facebook.github.io/react-native/docs/getting-started.html)

Follow these steps to run the project:

```
cd client/react-native
npm install
react-native link
react-native run-android
```

As on iOS

```
cd client/react-native/ios
pod install
cd ..
react-native run-ios
```


Please note that socket.io in `App.js` points to `localhost:4333`. Modify it in case you need to change your server URL.

```
const socketURL = 'http://localhost:4333'
```

## Run iOS Swift

```
cd client/native-ios-swift/DemoTrackingLocation
pod install

open DemoTrackingLocation.xcworkspace
```

## Run Android Kotlin

Open client/native-android-kotlin with your Android Studio (>= v.3). Hit `Run button` and choose your simulator.

## To Do

- [X] Parse XML content from GPX file.
- [X] Use SocketIO to emit to client
- [X] Client demo with website.
- [X] Client demo with React Native.
- [X] Client demo with iOS Native: Swift
- [X] Client demo with Android Native: Kotlin

## License
Feel free to use and pull request to contribute it as you want.
