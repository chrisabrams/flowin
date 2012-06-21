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
