Flow.compiler = function() {
	var calledDir   = Flow.path.called;
	var configPath  = calledDir + '/flow.json';
	var config      = require(configPath);

	var destination = (config.destination || false),
		files       = (config.files || false),
		filetype,
		input,
		output;

	if(destination) {
		destination = calledDir + destination;
	}

	Flow.compile.Js({
		calledDir   : calledDir,
		destination : (destination || false),
		frameworks  : (config.frameworks || false),
		src         : (config.src || false)
	});

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
						calledDir   : calledDir,
						destination : destination,
						input: input,
						output: output
					});

				default:

			}
		};
	}
};
