Flow.watch = function(o) {
	o = (o || {});

	var file = (o.file || false);

	if(file) {
		console.log("Watching: ", file);
		_fs.watch(file, {
			persistant: true
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
