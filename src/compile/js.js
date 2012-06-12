Flow.compile.Js = function(o) {
	o = (o || {});

	var calledDir   = (o.calledDir   || false),
		destination = (o.destination || false),
		frameworks  = (o.frameworks  || false),
		input       = (o.input       || false),
		list,
		output      = (o.output      || false),
		src         = (o.src         || false);

	if(src) {
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
		_fs.writeFileSync(destination, out.join(EOL), FILE_ENCODING);
	}

	if(input && output) {
		var file = _fs.readFileSync(calledDir + input, FILE_ENCODING);
		_fs.writeFileSync(calledDir + output, file, FILE_ENCODING);
	}
};
