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
  var config = { uglify: { 
                  files: {} 
                 },
                 options: {
                  compress: {
                      drop_console: true
                  },
                  mangle: true
                 }
               };

  // Compile all gameplay events files
  let eventsPath = __dirname + '/../public/js/events/';
  let eventsOutPath = __dirname + '/../public/release/events/';

  // Loop through all the files in the events dir
  let eventFiles = fs.readdirSync(__dirname + '/../public/js/events/');

  // Files to uglify
  config.uglify.files[fileOut] = [

    __dirname + '/../public/plugins/*.js',  // Plugins
    __dirname + '/../public/plugins/isotope/isotope.min.js',  // Isotope
    '!' + __dirname + '/../public/plugins/jquery.cycle2.js',
    '!' + __dirname + '/../public/plugins/jquery.cycle2.flip.js',
    '!' + __dirname + '/../public/bower_components/nosleep/*.js', // Ignore nosleep
    __dirname + '/../public/bower_components/progressbar.js/dist/progressbar.min.js',
    __dirname + '/../public/bower_components/ion-sound/js/ion.sound.min.js',
    __dirname + '/../public/bower_components/glidejs/src/Glide.js',
    __dirname + '/../public/gsap-timeline-slider.js',
  
  ];

  config.uglify.files[eventsOutPath + 'htyi.js'] = [eventsPath + 'htyi.js'];
  config.uglify.files[eventsOutPath + 'wikigeeks.js'] = [eventsPath + 'wikigeeks.js'];
  config.uglify.files[eventsOutPath + 'wwdmm.js'] = [eventsPath + 'wwdmm.js'];

  config.uglify.files[eventsOutPath + '/group/htyi.js'] = [eventsPath + '/group/htyi.js'];
  config.uglify.files[eventsOutPath + '/group/wikigeeks.js'] = [eventsPath + '/group/wikigeeks.js'];
  config.uglify.files[eventsOutPath + '/group/wwdmm.js'] = [eventsPath + '/group/wwdmm.js'];

  // TODO: Compile event files dynamically
/*  for(var ind in eventFiles) {

    grunt.log.writeln('Found file %s', eventFiles[ind])

    fs.stat(eventsPath + eventFiles[ind], ( error, stat ) => {
      if( error ) {
          grunt.log.writeln( "Error stating file.", error );
          return;
      }

      if(stat.isFile())
        config.uglify.files[eventsOutPath + eventFiles[ind]] = [eventsPath + eventFiles[ind]];

      if(ind === eventFiles.length-1) {
        grunt.log.writeln(config.uglify.files)
      }
        

    });

  }*/

  return config;
  
}
        