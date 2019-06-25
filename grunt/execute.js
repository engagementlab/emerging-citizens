// Node script execution
module.exports = function(grunt, options) {

  "use strict";

  // Obtain sites this job is running for
  var sitesArg = grunt.option('sites');

  // Obtain env to generate filename
  var env = grunt.option('env');

  if(!env) {
    
    grunt.log.writeln('No env provided, checking NODE_ENV');
    
    if(process.env.NODE_ENV !== undefined)
      env = process.env.NODE_ENV;
    else {
      grunt.log.subhead('No env provided, defaulting to production!');
      env = 'production';
    }

  }

  var config = {
  	  
	  news: {
	    src: ['jobs/news.js']
	  },
	
	  readme: {
	    src: ['jobs/readme.js']
	  },
	
	  cloudinary: {
	  	options: {
	  		args: []
	  	},
	    src: ['jobs/cdn.js']
	  },
  
    ssh_tunnel_from: {
      options: {
        args: ['from'],
        module: true
      },
      src: ['jobs/tunnel.js']
    },
  
    ssh_tunnel_to: {
      options: {
        args: ['to'],
        module: true
      },
      src: ['jobs/tunnel.js']
    }
	
	};

  // Use site modules arg only if defined
  if(sitesArg) {

    // Site are a comma-sep list
    var arrSites = sitesArg.replace('--sites=', '').split(',');

    // Tell cloudinary which files to upload preceded by site name
    for(var ind in arrSites) {
     
      config['cloudinary']['options']['args'].push(
    		[
    			arrSites[ind],
	        './node_modules/' + arrSites[ind] + '/public/release/' + env + '.js',
	        './node_modules/' + arrSites[ind] + '/public/release/' + env + '.css'
        ]
      )
    
    }

  }
  
	return config;

};
