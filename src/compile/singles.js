Flow.compile.Singles = function(o) {
	o = (o || {});

	var	calledDir = (o.calledDir || false),
		files     = (o.files     || false),
		filetype,
		input,
		output;

	if(files) {
		for(file in files) {
			input    = file.toString();
			output   = files[file].toString();
			filetype = input.substr(input.lastIndexOf('.') + 1);

			switch(filetype) {
				case "jade":
					Flow.compile.Jade({
						calledDir : calledDir,
						input     : input,
						output    : output
					});
					break;

				case "js":
					Flow.compile.Js({
						calledDir : calledDir,
						input     : input,
						output    : output
					});
					break;

				default:
			}
		};
	}
};
