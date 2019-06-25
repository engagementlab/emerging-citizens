module.exports = function(grunt, options) {

	var ignoreFilter = [];

	return {
	
		debug: {
			script: 'server.js',
			options: {
				nodeArgs: ['--inspect'],
				verbose: true,
				env: {
					port: 3000
				}
			}
		},

		serve: {
			script: 'app.js',
			options: {
				nodeArgs: ['--inspect'],
				verbose: true,
				ignore: ignoreFilter,
				ext: "js,hbs",
		    callback: function (nodemon) {
	        nodemon.on('log', function (event) {
	          console.log(event.colour);
	        });
	        nodemon.on('restart', function (event) {
	          console.log('node restarted');
	        });
	      },
			}
		}

	}

};
