'use strict';

const express = require('express');
const http = require('http');
const multer = require('multer');
const bodyParser = require('body-parser');
const socketIO = require('socket.io');

const fakeTracking = require('./FakeTracking');

// Get config for node environment
// Check `nodemon.json` for details
const ENV = process.env;

const CONFIG = {
	PORT: ENV.PORT
}

const app = express();

// Create socketIO and wrap app server inside
const server = http.Server(app);
const io = socketIO(server);


// Add middleware to handle post request for express
const form = multer();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/static', express.static('static'));

// Serve index.html for path '/', this is home path
app.get('/', (req, res) => {
	res.sendFile('index.html', { root: __dirname });
});


server.listen(CONFIG.PORT, () => {
	console.log('Server is running at port: ' + CONFIG.PORT);
});

// Run fake tracking location
fakeTracking.run(io);

io.on('connection', socket => {
	socket.emit('connectSuccess', {content: 'You have connected.'});
});
