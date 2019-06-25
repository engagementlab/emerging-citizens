module.exports = function(grunt, options) {

  "use strict";

  var sitesArg = grunt.option('sites');
  var destPath = __dirname + '/../node_modules/' + sitesArg + '/public/styles/core.css';
  var srcPath = __dirname + '/../node_modules/' + sitesArg + '/public/styles/core.scss';

	var dist = {
    options: {
      style: 'expanded',
      trace: true,
      sourceMap: true
    },
    files: {
      
    }
  }

  dist.files[destPath] = srcPath;

  return {'dist': dist};

};
