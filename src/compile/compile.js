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
							return _fs.readFileSync(item, FILE_ENCODING);
						});
						_fs.writeFileSync(calledDir + output, out.join(EOL), FILE_ENCODING);
					}
				});

				break;
		}
	}
};