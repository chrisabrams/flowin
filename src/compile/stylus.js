Flow.compile.stylus = function(o) {
	o = (o || {});	

	var output    = (o.output || false),
		paths     = (o.paths  || false),
		src       = (o.src    || false);
		/*sprite    = new StylusSprite({
			image_root: Flow.path.called + '/src/img',
			output_file: Flow.path.called + '/deploy/img/sprite.png'
		});*/

	stylus(fs.readFileSync(src, 'utf8')) //Get contents of stylus file
		//.set('filename', 'app.css')
		.set('paths', paths)
		/*.define('sprite', function(filename, option_val){
	        // preparation phase
	        return sprite.spritefunc(filename, option_val);
	    })*/
		.render(function(err, css) {
			//console.log(css);
			fs.writeFileSync(output, css, 'utf8');
			//if (err) throw err;

	        // rendering phase
	        /*sprite.build(css, function(err, css){
	            //if (err) throw err;
	            console.log(css);
	        });*/
		});
};
