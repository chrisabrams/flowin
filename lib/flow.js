var FILE_ENCODING = 'utf-8',
    EOL = '\n';

// setup
var fs  = require('fs'),
	exec = require('child_process').exec,
	//sass = require(__dirname + '/../node_modules/node-sass/sass'),
	stylus = require('stylus'),
	StylusSprite = require("stylus-sprite"),
	util = require('util'),
	wrench = require('wrench');

var Flow = {};

if(typeof exports !== "undefined") {
	exports = module.exports = function(path) {
		Flow.path = path;

		return Flow;
	};
}

Flow.compile = {};
Flow.compile.html = function(o, callback) {

	var command   = Flow.path.markx + ' ',
		md        = (o.md     || false),
		output    = (o.output || false),
		jade      = (o.jade   || false),
		src       = false;

	if(jade && md) {
		command += '--template ' + jade + ' ';
		src = md;
	}

	if(jade && !md) {
		src = jade;
	}

	if(!jade && md) {
		src = md;
	}

	if(output && src) {
		command += src + ' > ';
		command += output;

		exec(command, function(error, stdout, stderr) {
			
			if(error !== null) {
				console.log('exec error: ' + error);
				console.log('stdout: ' + stdout);
				console.log('stderr: ' + stderr);
			} else {
				callback();
			}
		});
	}
};

Flow.compile.stylus = function(o) {
	o = (o || {});	

	var output    = (o.output || false),
		paths     = (o.paths  || false),
		src       = (o.src    || false);
		/*sprite    = new StylusSprite({
			image_root: Flow.path.called + '/src/img',
			output_file: Flow.path.called + '/deploy/img/sprite.png'
		});*/

	stylus(fs.readFileSync(src, 'utf8')) //Get contents of stylus file
		//.set('filename', 'app.css')
		.set('paths', paths)
		/*.define('sprite', function(filename, option_val){
	        // preparation phase
	        return sprite.spritefunc(filename, option_val);
	    })*/
		.render(function(err, css) {
			//console.log(css);
			fs.writeFileSync(output, css, 'utf8');
			//if (err) throw err;

	        // rendering phase
	        /*sprite.build(css, function(err, css){
	            //if (err) throw err;
	            console.log(css);
	        });*/
		});
};

Flow.compiler = function(o) {
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
				for(file in files) {
					output = (files[file].toString() || false);
					src    = (file.toString()        || false);

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
				}

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
							return fs.readFileSync(item, FILE_ENCODING);
						});
						fs.writeFileSync(calledDir + output, out.join(EOL), FILE_ENCODING);
					}
				});

				break;
		}
	}
};
Flow.init = function(o) {
	o = (o || {});

	var watch       = (o.watch || true),
		fileList    = [];

	var calledDir   = Flow.path.called;
	var configPath  = calledDir + '/flow.json';
	var config      = require(configPath);
	var project     = (config.project || false);

	//Will recompile project when settings file is updated
	fileList.push(calledDir + '/flow.json');

	if(project) {
		var css  = (project.css  || false),
			html = (project.html || false),
			js   = (project.js   || false);

		if(css) {
			for(cssFile in css.files) {
				Flow.compile[css.engine]({
					output: calledDir + css.files[cssFile],
					src:    calledDir + cssFile,
					paths: [
						calledDir + '/src/stylus/'
					]
				});

				fileList.push(calledDir + cssFile.toString())
			}
		}

		if(html && html.files) {
			Flow.compiler({
				calledDir : calledDir,
				files     : html.files,
				type      : 'html'
			});

			for(htmlFile in html.files) {
				fileList.push(calledDir + htmlFile.toString())
			}
		}

		if(js && js.files) {
			Flow.compiler({
				calledDir : calledDir,
				files     : js.files,
				type      : 'js'
			});

			js.files.forEach(function(file, key) {
				if(file.frameworks) {
					file.frameworks.forEach(function(file, key) {
						fileList.push(file.toString());
					});
				}

				file.src.forEach(function(file, key) {
					fileList.push(calledDir + file.toString());
				});
			});
		}
	}

	if(watch) {
		fileList.forEach(function(val, key) {
			Flow.watch({
				file: val
			});
		});
	}
};

Flow.watch = function(o) {
	o = (o || {});

	var file = (o.file || false);

	if(file) {
		console.log("Watching: ", file);
		fs.watch(file, {
			persistant: true,
			internal: 1000
		}, function(ev, file) {
			console.log(' ');
			console.log('Compiling...');
			console.log(' ');

			Flow.init({
				watch: false
			});
		});
	}
};
