module.exports = function(grunt, options) {

	return {
	
		js: {
			files: [
				'model/**/*.js',
				'routes/**/*.js'
			],
			tasks: ['jshint:all']
		},
		express: {
			files: [
				'server.js',
				'public/js/lib/**/*.{js,json}'
			],
			tasks: ['jshint:server', 'concurrent:dev']
		},
		sass: {
			files: '/public/styles/**/*.scss',
			tasks: ['sass']
		},
		livereload: {
			files: [
				'public/styles/**/*.css',
			],
			options: {
				livereload: true
			}
		}

	}

};
