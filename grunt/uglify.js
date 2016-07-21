'use strict'

// Site-wide JS
module.exports = function(grunt, options) {

  var fs = require('fs');

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

  grunt.log.writeln('Compiling ' + env + '.js');

  // Output file is relative to this site
  var fileOut = __dirname + '/../public/release/' + env + '.js';
  var config = { uglify: { files: {} } };

  // Compile all gameplay events files
  let eventsPath = __dirname + '/../public/release/events/';

  // Loop through all the files in the events dir
  let eventFiles = fs.readdirSync(__dirname + '/../public/js/events/');

  // TODO: Compile event files
/*  for(var ind in eventFiles) {

    grunt.log.writeln('Found file %s', eventFiles[ind])

    fs.stat(eventsPath + eventFiles[ind], ( error, stat ) => {
      if( error ) {
          grunt.log.writeln( "Error stating file.", error );
          return;
      }

      if(stat.isFile())
          grunt.log.writeln( "'%s' is a file.", fromPath );

    });

  }*/

  // Files to uglify
  config.uglify.files[fileOut] = [

    __dirname + '/../public/js/*.js', // js for the site
    __dirname + '/../public/js/jquery/*.js', // jquery
    __dirname + '/../public/plugins/*.js',  // Plugins
    __dirname + '/../public/plugins/**/*.js',
    '!' + __dirname + '/../public/bower_components/nosleep/*.js', // Ignore nosleep
    __dirname + '/../public/bower_components/progressbar.js/dist/progressbar.min.js',
    __dirname + '/../public/bower_components/ion-sound/js/ion.sound.min.js',
    __dirname + '/../public/gsap-timeline-slider.js',
  
  ];

  return config;
  
}
        