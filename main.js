// Add EJS serial
var config = require('./config.json');
var EJS = require('./ejs');
EJS.init();


// Create express app
var express = require('express');
var app = express();
app.use(express.static(__dirname + '/client'));
app.use(express.vhost(config.domain, app));

var http = require('http');
var server = http.createServer(app).listen(config.port);

// Add Now.js
var nowjs = require('now');
var everyone = nowjs.initialize(server);
