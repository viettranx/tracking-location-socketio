'use strict';

const cheerio = require('cheerio');
const fs = require('fs');

let socketIO = null;
const dirName = 'gpx/';


let trackingState = {}


const emitRoute = (routeName, routeNodes, currentIndex) => {

  if (currentIndex == routeNodes.length) {
    return setTimeout( () => {
      // reverse route path and continue tracking
      emitRoute(routeName, routeNodes, 0);
    }, 3000);
  }

  trackingState = Object.assign(trackingState, { 
    [routeName] : routeNodes[currentIndex]
  });

  socketIO.emit( 'locationUpdated', trackingState );

  // Random a number in range 500 - 1000
  const sleepTime = Math.random() * (1000 - 500) + 500;

  // Dispatch time out to avoid stack overflow,
  // we use recursive calling to emit route forever
  return setTimeout(() => {
    emitRoute(routeName, routeNodes, ++currentIndex);
  }, sleepTime)
}

const run = io => {

  socketIO = io;

  fs.readdir(dirName, (err, filenames) => {
    if (err) {
      console.log(err);
      return;
    }

    filenames.forEach( filename => {

      // Check file extension, only accept *.gpx
      const fileExtension = filename.split('.').pop()
      if (fileExtension !== 'gpx') return;

      console.log('Parsing file: ' + dirName + filename);

      fs.readFile(dirName + filename, 'utf-8', (err, content) => {
        if (err) {
          console.log(err);
          return;
        }

        // Treat each file gpx as a new route        
        trackingState = Object.assign(trackingState, { 
          [ filename ] : { lat: 0, lng: 0 }
        });

        // Parse XML with cheerio
        const $ = cheerio.load(content, {
          normalizeWhitespace: true,
          xmlMode: true
        });

        // Transfer xmlNode object to plain object { lat : ..., lng: ...}
        const routeNodes = $('trkpt').map( (i, node) => ({
          lat : Number($(node).attr('lat')),
          lng : Number($(node).attr('lon'))
        })).get();

        // Emit route to client
        if (routeNodes.length > 0) {
          emitRoute(filename, routeNodes, 0); // start at first route node
        }
      });      
    });
  });
}

module.exports.run = run;