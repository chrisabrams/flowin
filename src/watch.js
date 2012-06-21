Flow.watch = function(o) {
	o = (o || {});

	var file = (o.file || false);

	if(file) {
		console.log("Watching: ", file);
		fs.watch(file, {
			persistant: true,
			internal: 1000
		}, function(ev, file) {
			console.log(' ');
			console.log('Compiling...');
			console.log(' ');

			Flow.init({
				watch: false
			});
		});
	}
};
