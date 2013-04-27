////////////////////////////////////////////////////////
// Use the cool library                               //
// git://github.com/voodootikigod/node-serialport.git //
// to read the serial port where arduino is sitting.  //
////////////////////////////////////////////////////////
// var com = require("serialport");
// var EJS = {
//   lane1TotalTime : 0,
//   lane2TotalTime : 0
// };

// var serialPort = new com.SerialPort("/dev/cu.usbserial", {
//     baudrate: 38400,
//     parser: com.parsers.readline("\n\r")
//     //parser: com.parsers.readline('\r\n')
//   });

// serialPort.on('open',function() {
//   console.log('Port open');
// });

// serialPort.on('data', function(data) {
//   //var dataString = data.toString();
//   //data = "--" + data + "--";
//   //console.log(data);

//   if (!data.length) { return; }

//   var startChar = data.substr(0,1);
//     switch(startChar) {
//       case 'u':
//         console.log("Standing by...");
//         break;

//       case 'd':
//         var timeReading = data.substr(1, 6);
//         var timeReadingMS = h2d(timeReading);
//         var startTime = (timeReadingMS - 3000) / 1000;
//         var time = startTime.toFixed(2);
//         var dogTime = time - EJS.lane1TotalTime;
//         if (dogTime < 2 && EJS.lane1TotalTime !== 0) { return; }

//         EJS.lane1TotalTime = time;

//         console.log("Dog Time: " + dogTime);
//         console.log("Total Time: " + EJS.lane1TotalTime);

//         everyone.now.receiveHeatTime('L', dogTime, 0.03, dogTime - 0.03);
//         everyone.now.receiveHeatTotalTime('L', EJS.lane1TotalTime, 0.03, dogTime - 0.03);

//         break;

//       case 'r':
//         console.log("Resetting...");
//         break;

//       case 's':
//         console.log("Starting...");
//         break;

//       case 'z':
//         console.log("Race begin...");
//         break;

//       case 't':
//         console.log("Race Stopped...");
//         break;
//     }
// });

/**
 * Return the decimal value of a hex
 */
function h2d(h) {
  return parseInt(h,16);
}


/**
 * Setup the http server
 * The variable clientCode is the code above and
 * can be set in this file or you could read it in from
 * a file. See the node.js documentation for
 * filesystem interaction
 */
var http = require('http');
httpServer = http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(clientCode);
});
httpServer.listen(1337, "127.0.0.1");

/**
 * Add Now.js
 */
var nowjs = require('now');
var everyone = nowjs.initialize(httpServer);
