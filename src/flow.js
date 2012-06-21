var FILE_ENCODING = 'utf-8',
    EOL = '\n';

// setup
var fs  = require('fs'),
	exec = require('child_process').exec,
	//sass = require(__dirname + '/../node_modules/node-sass/sass'),
	stylus = require('stylus'),
	//StylusSprite = require("stylus-sprite"),
	util = require('util'),
	wrench = require('wrench');

var Flow = {};
