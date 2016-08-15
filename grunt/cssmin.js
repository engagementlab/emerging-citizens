// Site-wide stylesheets
module.exports = function(grunt, options) {

  // Obtain env to generate filename
  var env = grunt.option('env');

  if(env === undefined) {
    
    grunt.log.writeln('No env provided, checking NODE_ENV');
    
    if(process.env.NODE_ENV !== undefined)
      env = process.env.NODE_ENV;
    else {
      grunt.log.subhead('No env provided, defaulting to production!');
      env = 'production'
    }

  }

  grunt.log.writeln('Compiling ' + env + '.css');

  // Output file is relative to this site
  var fileOut = __dirname + '/../public/release/' + env + '.css';
  var config = { 
    options: { keepSpecialComments: 0 },
    target: { files: {} }
  };

  // Files to minify
  config.target.files[fileOut] = [

    __dirname + '/../public/styles/core.css', // site SCSS
    __dirname + '/../public/styles/plugins/*.css' // plugins
  
  ];

  return config;
  
}
