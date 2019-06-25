module.exports = function(grunt, options) {

	var devTasks = [
		'nodemon:serve',
		'watch'
	];

	var config = {

		dev: {
			tasks: devTasks, 	
			options: {
				logConcurrentOutput: true
			}
		}

	};

	return config;
	

};
