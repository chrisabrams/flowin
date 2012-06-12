var FILE_ENCODING = 'utf-8',
    EOL = '\n';

// setup
var _fs  = require('fs'),
	exec = require('child_process').exec,
	//sass = require(__dirname + '/../node_modules/node-sass/sass'),
	util = require('util');

var Flow = {};

if(typeof exports !== "undefined") {
	exports = module.exports = function(path) {
		Flow.path = path;

		return Flow;
	};
}

Flow.compile = {};

Flow.compile.Jade = function(o) {
	o = (o || {});

	var calledDir = (o.calledDir || false),
		input     = (o.input     || false),
		output    = (o.output    || false);

	var command   = Flow.path.markx + ' ' + calledDir + input + ' > ' + calledDir + output;

	exec(command, function(error, stdout, stderr) {
		//console.log('stdout: ' + stdout);
		//console.log('stderr: ' + stderr);
		if (error !== null) {
			console.log('exec error: ' + error);
		}
	});
};

Flow.compile.Js = function(o) {
	o = (o || {});

	var calledDir   = (o.calledDir   || false),
		destination = (o.destination || false),
		frameworks  = (o.frameworks  || false),
		input       = (o.input       || false),
		output      = (o.output      || false),
		src         = (o.src         || false);

	if(frameworks && src) {
		var srcList     = src.map(function(srcItem) {
			return calledDir + srcItem;
		});
		var list        = frameworks.concat(srcList);

		var out = list.map(function(item) {
			return _fs.readFileSync(item, FILE_ENCODING);
		});
		_fs.writeFileSync(destination, out.join(EOL), FILE_ENCODING);
	}

	if(input && output) {
		var file = _fs.readFileSync(calledDir + input, FILE_ENCODING);
		_fs.writeFileSync(calledDir + output, file, FILE_ENCODING);
	}
};

Flow.compiler = function() {
	var calledDir   = Flow.path.called;
	var configPath  = calledDir + '/flow.json';
	var config      = require(configPath);

	var destination = calledDir + config.destination,
		files       = config.files,
		filetype,
		input,
		output;

	Flow.compile.Js({
		calledDir   : calledDir,
		destination : destination,
		frameworks  : config.frameworks,
		src         : config.src
	});

	for(file in files) {
		input    = file.toString();
		output   = files[file].toString();
		filetype = input.substr(input.lastIndexOf('.') + 1);

		switch(filetype) {
			case "jade":
				Flow.compile.Jade({
					calledDir : calledDir,
					input     : input,
					output    : output
				});
				break;

			case "js":
				Flow.compile.Js({
					calledDir   : calledDir,
					destination : destination,
					input: input,
					output: output
				});

			default:

		}
	};
};
