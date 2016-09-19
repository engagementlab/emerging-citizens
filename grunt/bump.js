module.exports = function(grunt, options) {

	var 
	production = {
	  options: {
	    commit: false,
	    createTag: true,
	    tagName: 'v%VERSION%',
	    tagMessage: 'Production Version %VERSION%',
	    push: true,
	    pushTo: 'origin'
	  }
	},

	staging = {
	  options: {
	    files: [__dirname + '/../package.json'],
	    commit: true,
	    commitMessage: 'Staging Release v%VERSION%',
	    commitFiles: [__dirname + '/../package.json'],
	    createTag: true,
	    tagName: 'v%VERSION%',
	    tagMessage: 'Version %VERSION%',
	    push: true,
	    pushTo: 'origin'
	  }
	}

	return {
		'production': production,
		'staging': staging
	};
      
};
