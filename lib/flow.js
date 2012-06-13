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
		list,
		output      = (o.output      || false),
		src         = (o.src         || false);

	if(destination && src) {
		var srcList = src.map(function(srcItem) {
			return calledDir + srcItem;
		});

		if(frameworks) {
			list = frameworks.concat(srcList);
		} else {
			list = srcList;
		}

		var out = list.map(function(item) {
			return _fs.readFileSync(item, FILE_ENCODING);
		});
		_fs.writeFileSync(calledDir + destination, out.join(EOL), FILE_ENCODING);
	}

	if(input && output) {
		var file = _fs.readFileSync(calledDir + input, FILE_ENCODING);
		_fs.writeFileSync(calledDir + output, file, FILE_ENCODING);
	}
};

Flow.compile.Singles = function(o) {
	o = (o || {});

	var	calledDir = (o.calledDir || false),
		files     = (o.files     || false),
		filetype,
		input,
		output;

	if(files) {
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
						calledDir : calledDir,
						input     : input,
						output    : output
					});
					break;

				default:
			}
		};
	}
};

Flow.watch = function(o) {
	o = (o || {});

	var file = (o.file || false);

	if(file) {
		_fs.watch(file, {
			persistant: true
		}, function(ev, file) {
			Flow.compiler({
				watch: false
			});
		});
	}
};

Flow.compiler = function(o) {
	o = (o || {});

	var watch       = (o.watch || true),
		fileList    = [];

	var calledDir   = Flow.path.called;
	var configPath  = calledDir + '/flow.json';
	var config      = require(configPath);
	var project     = (config.project || false);

	if(project) {
		var css  = (project.css  || false),
			html = (project.html || false),
			js   = (project.js   || false);

		if(css) {

		}

		if(html) {
			if(html.singles) {
				Flow.compile.Singles({
					calledDir : calledDir,
					files     : html.singles
				});

				for(htmlSingle in html.singles) {
					fileList.push(htmlSingle.toString());
				}
			}
		}

		if(js) {
			if(js.destination && js.frameworks && js.src) {
				Flow.compile.Js({
					calledDir   : calledDir,
					destination : (js.destination || false),
					frameworks  : (js.frameworks  || false),
					src         : (js.src         || false)
				});

				js.src.forEach(function(val, key) {
					fileList.push(val.toString());
				});
			}

			if(js.singles) {
				Flow.compile.Singles({
					calledDir : calledDir,
					files     : js.singles
				});

				for(jsSingle in html.singles) {
					fileList.push(jsSingle.toString());
				}
			}
		}
	}

	if(watch) {
		fileList.forEach(function(val, key) {
			Flow.watch({
				file: calledDir + val
			});
		});
	}
};
