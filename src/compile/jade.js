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
