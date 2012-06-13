Flow.watch = function(o) {
	o = (o || {});

	var file = (o.file || false);

	if(file) {
		_fs.watch(file, {
			persistant: true
		}, function(ev, file) {
			Flow.compiler({
				watch: false
			});
		});
	}
};
