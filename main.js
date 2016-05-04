var config = require('./config.json');

 // Create express app & add socket.io
var express = require('express');
var app = express();
app.use(express.static(__dirname + '/client'));
app.use(express.vhost(config.domain, app));
app.use(express.vhost(config.domain1, app));
var http = require('http');
var server = http.createServer(app).listen(config.port, "0.0.0.0");
var io = require('socket.io').listen(server);

// Connect to serial port
var com = require("serialport");
var serialPort = new com.SerialPort(config.serialPort, {
  baudrate: 38400,
  parser: com.parsers.readline("\n\r")
  //parser: com.parsers.readline('\r\n')
});

// On connection to serial port
serialPort.on('open',function() {
  console.log('Port open');
});

// On incomming data from serial port.
serialPort.on('data', function(data) {
  //var dataString = data.toString();
  //data = "--" + data + "--";
  //console.log(data);

  if (!data.length) { return; }


  var EJSdata = EJS.processData(data);

  switch(EJSdata.eventType) {
    case 'u':
      console.log("Standing by...");
      break;

    case 'd':
      console.log("Sensor Data...");
      EJS.processSensorData(EJSdata);
      break;

    case 'r':
      EJS.reset();
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
      EJS.stopRace(EJSdata);
      console.log("Race Stopped...");
      io.sockets.emit('raceFinish', {});
      break;
  }
});

var EJSheat = {
  lane1 : {
    totalTime : 0,
    lastUpdate: 0,
    dogIn : false,
    totals : {
      total : 0,
      pass : 0,
      perfect : 0
    },
    splits : []
  },
  lane2 : {
    totalTime : 0,
    lastUpdate: 0,
    dogIn : false,
    totals : {
      total : 0,
      pass : 0,
      perfect : 0
    },
    splits : []
  }
};

// EJS object to handle sensor data and race info
var EJS = {
  startSequenceTime : config.startSequenceTime,
  race : JSON.parse(JSON.stringify(EJSheat)),

  processData : function(data) {
    return {
      eventType : data.substr(0, 1),
      timeReading : data.substr(1, 6),
      timeReadingMS : EJS.h2d(data.substr(1, 6)),
      status : EJS.h2d(data.substr(7, 2)),
      sensors : data.substr(9, 2),
      mod : EJS.h2d(data.substr(11, 2)),
      switches : EJS.h2d(data.substr(13, 2))
    }
  },

  processSensorData : function(data) {
    console.log(this.race);
    switch (data.sensors) {
      // Left lane front sensors.
      case '10':
      case '11':
        this.addSplitForLane('lane1', data.timeReadingMS);
      break;

      // Right lane front sensors.
      case '40':
      case '44':
        this.addSplitForLane('lane2', data.timeReadingMS);
      break;

    }
  },

  addSplitForLane : function(lane, time) {
    var lastUpdate = this.race[lane].lastUpdate;
    if (lastUpdate + 2000 < time || lastUpdate == 0) {
      this.race[lane].lastUpdate = time;
      // If the start time then remove EJS start sequence from time.
      if (lastUpdate == 0) {
        time = time - EJS.startSequenceTime;
      }
      var splitTime = this.convertTime(time - lastUpdate);
      console.log(splitTime);
      this.race[lane].splits.push(splitTime);
      // Update webclient.
      var uiLane = lane == 'lane1' ? 'L' : 'R';
      io.sockets.emit('receiveNewHeatTime', { lane: uiLane, time: splitTime, pass: '0.00', perfect: '0.00' });
    }
  },

  stopRace : function(data) {
    this.race.lane1.TotalTime = this.convertTime(this.race.lane1.lastUpdate, true);
    this.race.lane2.TotalTime = this.convertTime(this.race.lane2.lastUpdate, true);
    // Update webclient.
    io.sockets.emit('receiveHeatTotalTime', { lane: 'L', time: this.race.lane1.TotalTime, pass: '0.00', perfect: '0.00' });
    io.sockets.emit('receiveHeatTotalTime', { lane: 'R', time: this.race.lane2.TotalTime, pass: '0.00', perfect: '0.00' });
  },

  reset : function() {
    this.race = JSON.parse(JSON.stringify(EJSheat));
    io.sockets.emit('raceReset');
  },

  convertTime : function(time, removeStart) {
    var removeStart = typeof removeStart !== 'undefined' ?  removeStart : false;
    if (removeStart) {
      time = time - EJS.startSequenceTime;
    }
    time = time / 1000;
    console.log(time);
    return Number(Math.round(time+'e2')+'e-2');
  },

  h2d : function(h) {
    return parseInt(h,16);
  }
};



// io.sockets.on('connection', function (socket) {
//   socket.emit('receiveNewHeatTime', { lane: 'L', time: '3.94', pass: '0.03', perfect: '3.91' });
//   socket.on('my other event', function (data) {
//     console.log(data);
//   });
// });
