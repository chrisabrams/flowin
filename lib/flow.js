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

Flow.compile = function(o) {
	o = (o || {});

	var calledDir = (o.calledDir || false),
		files     = (o.files     || []),
		frameworks,
		list,
		minify,
		out,
		output,
		src,
		srcList,
		type      = (o.type      || false);

	if(calledDir && files && type) {
		switch(type) {
			case 'html':
				files.forEach(function(file, key) {
					output     = (file.output     || false);
					src        = (file.src        || false);

					if(output && src) {
						var command  = Flow.path.markx + ' ' + calledDir + src + ' > ' + calledDir + output;
						//filetype = input.substr(input.lastIndexOf('.') + 1);

						exec(command, function(error, stdout, stderr) {
							//console.log('stdout: ' + stdout);
							//console.log('stderr: ' + stderr);
							if (error !== null) {
								console.log('exec error: ' + error);
							}
						});
					}
				});

				break;

			case 'js':
				files.forEach(function(file, key) {
					frameworks = (file.frameworks || false);
					output     = (file.output     || false);
					src        = (file.src        || false);

					if(output && src) {
						srcList = src.map(function(srcItem) {
							return calledDir + srcItem;
						});

						if(frameworks) {
							list = frameworks.concat(srcList);
						} else {
							list = srcList;
						}

						out = list.map(function(item) {
							return _fs.readFileSync(item, FILE_ENCODING);
						});
						_fs.writeFileSync(calledDir + output, out.join(EOL), FILE_ENCODING);
					}
				});

				break;
		}
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

		if(html && html.files) {
			Flow.compile({
				calledDir : calledDir,
				files     : html.files,
				type      : 'html'
			});

			html.files.forEach(function(file, key) {
				file.src.forEach(function() {
					fileList.push(file.toString());
				});
			});
		}

		if(js && js.files) {
			Flow.compile({
				calledDir : calledDir,
				files     : js.files,
				type      : 'js'
			});

			js.files.forEach(function(file, key) {
				file.src.forEach(function(file, key) {
					fileList.push(file.toString());
				});
			});
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
