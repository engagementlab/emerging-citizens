module.exports = function(grunt, options) {

  var sources = [];
	var sitesArg = grunt.option('sites');

	// Use site modules arg only if defined
	if(sitesArg !== undefined) {

		// Site are a comma-sep list
		var arrSites = sitesArg.replace('--sites=', '').split(',');

		// Watch all site modules
		for(var ind in arrSites)
				sources.push('node_modules/' + arrSites[ind] +'/test/*.js');

	}
	else
		sources = ['../test/*.js'];

	return {

		all: {

	    options: {
	      reporter: 'spec',
	      quiet: false, // Optionally suppress output to standard out (defaults to false) 
	      clearRequireCache: false, // Optionally clear the require cache before running tests (defaults to false) 
	      src: sources
	    }
	  
	  }
  
  };

};
