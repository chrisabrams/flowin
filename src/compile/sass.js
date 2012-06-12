Flow.compile.Sass = function(o) {
	o = (o || {});

	var calledDir = (o.calledDir || false),
		input     = (o.input     || false),
		output    = (o.output    || false);

	sass.middleware({
		src: input
		, dest: output
		, debug: true
	})
};
