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
