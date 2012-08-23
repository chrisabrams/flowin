[![build status](https://secure.travis-ci.org/chrisabrams/flowin.png)](http://travis-ci.org/chrisabrams/flowin)
#Flow

##Compiling Jade and Markdown to HTML

###Markdown to HTML
Supply the path to the .md file and the path to the output .html

	Flow.compile.html({
		md     : 'path/to/content.md',
		output : 'path/to/content.html'
	});

###Jade to HTML
Supply the path to the .jade file and the path to the output .html

	Flow.compile.html({
		jade   : 'path/to/template.jade',
		output : 'path/to/template.jade'
	});

###Jade + Markdown to HTML
Jade can be used as a template and markdown can be written as the content

	Flow.compile.html({
		jade   : 'path/to/template.jade',
		md     : 'path/to/content.md',
		output : 'path/to/combined.html'
	});