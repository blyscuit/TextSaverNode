// Import the Express module
var express = require('express');

// Import the 'path' module (packaged with Node.js)
var path = require('path');

// Create a new instance of Express
var app = express();

var http = require('http');
var url = require('url');
var fs = require('fs');

// Create a simple Express application
app.configure(function() {
    // Turn down the logging activity
    app.use(express.logger('dev'));

    // Serve static html, js, css, and image files from the 'public' directory
    app.use(express.static(path.join(__dirname,'public')));
    
    
});

// Create a Node.js based http server on port 8080
var server = require('http').createServer(app).listen(process.env.PORT || 8080);

// Create a Socket.IO server and attach it to the http server
var io = require('socket.io').listen(server);

// Reduce the logging output of Socket.IO
io.set('log level',1);

// Listen for Socket.IO Connections. Once connected, start the game logic.
// define interactions with client
io.sockets.on('connection', function(socket){
    //send data to client
    setInterval(function(){
        socket.emit('date', {'date': new Date()});
    }, 1000);

setInterval(function(){
var textFromdata='';
	fs.readFile('message.txt', function (err, data) {
 	 if (err) throw err;
textFromdata = ''+data;
console.log(textFromdata);
  	socket.emit('loadText', { text: textFromdata });
	});
	
    }, 100);

    //recieve client data
    socket.on('client_data', function(data){
        process.stdout.write(data.letter);
fs.appendFile('message.txt', data.letter, function (err) {
  if (err) throw err;
  console.log('It\'s saved!');
});
    });
});
