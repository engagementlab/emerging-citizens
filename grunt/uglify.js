// Site-wide JS
module.exports = function() {

  // Output file is relative to this site
  var fileOut = __dirname + '/../public/release/production.js';
  var config = { uglify: { files: {} } };

  // Files to uglify
  config.uglify.files[fileOut] = [

    __dirname + '/../public/js/*.js', // js for the site
    __dirname + '/../public/js/jquery/*.js', // jquery
    __dirname + '/../public/plugins/*.js',  // Plugins
    __dirname + '/../public/plugins/**/*.js',
    '!'+__dirname + '/../public/bower_components/nosleep/NoSleep.js',
    __dirname + '/../public/bower_components/progressbar.js/dist/progressbar.min.js',
    __dirname + '/../public/bower_components/ion-sound/js/ion.sound.min.js',
    __dirname + '/../public/gsap-timeline-slider.js',
  
  ];

  return config;
  
}
        