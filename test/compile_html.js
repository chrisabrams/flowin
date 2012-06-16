var exec   = require('child_process').exec,
	path   = require('path'),
	util   = require('util');

var Flow = require('../lib/flow')({
	called : process.cwd(),
	lib    : __dirname + '/../lib',
	markx  : __dirname + '/../node_modules/markx/bin/markx'
});

describe('Flow.compile.html', function() {
	it('should be able to compile .md to .html', function() {
		Flow.compile.html({
			md     : Flow.path.lib + '/compile_html/src/content.md',
			output : Flow.path.called + '/testfiles/content.html'
		});
	});

	it('should be able to compile .jade to .html', function() {
		Flow.compile.html({
			jade   : Flow.path.lib + '/compile_html/src/template.jade',
			output : Flow.path.called + '/testfiles/template.html'
		});
	});

	it('should be able to compile .jade + .md to .html', function() {
		Flow.compile.html({
			jade   : Flow.path.lib + '/compile_html/src/template.jade',
			md     : Flow.path.lib + '/compile_html/src/content.md',
			output : Flow.path.called + '/testfiles/combined.html'
		});
	});
});