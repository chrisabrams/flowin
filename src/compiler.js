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
