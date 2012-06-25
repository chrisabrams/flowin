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

		fs.unlinkSync(output);

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
