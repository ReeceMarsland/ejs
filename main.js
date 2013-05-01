 var config = require('./config.json');

 // Create express app & add socket.io
var express = require('express');
var app = express();
app.use(express.static(__dirname + '/client'));
app.use(express.vhost(config.domain, app));
var http = require('http');
var server = http.createServer(app).listen(config.port);
var io = require('socket.io').listen(server);


var com = require("serialport");
var EJS = {
  lane1TotalTime : 0,
  lane2TotalTime : 0
};

var serialPort = new com.SerialPort(config.serialPort, {
    baudrate: 38400,
    parser: com.parsers.readline("\n\r")
    //parser: com.parsers.readline('\r\n')
  });

serialPort.on('open',function() {
  console.log('Port open');
});

serialPort.on('data', function(data) {
  //var dataString = data.toString();
  //data = "--" + data + "--";
  console.log(data);

  if (!data.length) { return; }

  var startChar = data.substr(0,1);
    switch(startChar) {
      case 'u':
        console.log("Standing by...");
        break;

      case 'd':
        var timeReading = data.substr(1, 6);
        var timeReadingMS = h2d(timeReading);
        var startTime = (timeReadingMS - 3000) / 1000;
        var time = startTime.toFixed(2);
        var dogTime = time - EJS.lane1TotalTime;
        //if (dogTime < 2 && EJS.lane1TotalTime !== 0) { return; }

        EJS.lane1TotalTime = time;

        console.log("Dog Time: " + dogTime);
        console.log("Total Time: " + EJS.lane1TotalTime);

        io.sockets.emit('receiveNewHeatTime', { lane: 'L', time: dogTime, pass: '0.03', perfect: dogTime - 0.03 });
        io.sockets.emit('receiveHeatTotalTime', { lane: 'L', time: EJS.lane1TotalTime, pass: '0.03', perfect: 0.00 });

        break;

      case 'r':
        console.log("Resetting...");
        io.sockets.emit('raceReset', {});
        break;

      case 's':
        console.log("Starting...");
         io.sockets.emit('raceStart', {});
        break;

      case 'z':
        console.log("Race begin...");
         io.sockets.emit('raceBegin', {});
        break;

      case 't':
        console.log("Race Stopped...");
         io.sockets.emit('raceFinish', {});
        break;
    }
});

/**
 * Return the decimal value of a hex
 */
function h2d(h) {
  return parseInt(h,16);
}


// io.sockets.on('connection', function (socket) {
//   socket.emit('receiveNewHeatTime', { lane: 'L', time: '3.94', pass: '0.03', perfect: '3.91' });
//   socket.on('my other event', function (data) {
//     console.log(data);
//   });
// });
