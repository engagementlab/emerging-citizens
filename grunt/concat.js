module.exports = {

	readme: {
		src: ['docs/INSTALLING.md', 'docs/CODE.md'],
		dest: 'README.md'
	},

  dist: {
      src: ['public/css/**/*.css', 
            'public/plugins/**/*.css',
            'public/fonts/**/*.css',
            'public/fonts/*.css',
            'public/bower_components/**/dist/css/*.min.css',
            '!public/bower_components/glidejs/dist/css/glide.theme.min.css', // We are using our own glide theme; exclude
            '!public/static' // Do not use any static css
            ],
      dest: 'public/release/tmp/concat.css'
  }

};
