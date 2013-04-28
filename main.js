// Add EJS serial
var EJS = require('./ejs');
EJS.init();


// Create express app
var express = require('express');
var app = express();
app.use(express.static(__dirname + '/client'));
app.use(express.vhost('EJS.app', app));

var http = require('http');
var server = http.createServer(app).listen(80);

// Add Now.js
var nowjs = require('now');
var everyone = nowjs.initialize(server);
