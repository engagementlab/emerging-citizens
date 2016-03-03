/**
 * Emerging Citizens
 * Developed by Engagement Lab, 2016
 * ==============
 * Template loader.
 *
 * @class lib
 * @static
 * @author Johnny Richardson
 *
 * ==========
 */

var fs = require('fs');
var handlebars = require('handlebars');
var rootDir = require('app-root-path');

var TemplateLoader = function(filePath, data, callback) {

  // this will be called after the file is read
  function renderToString(source, data) {
    var template = handlebars.compile(source);

    var outputString = template(data);
    return outputString;
  }

  fs.readFile(rootDir + '/templates/partials/' + filePath + '.hbs', function(err, file) {
    
    if (!err) {
      
      // make the buffer into a string
      var source = file.toString();
      // call the render function
      var msg = renderToString(source, data);

      callback(msg);

    } 
    else
        throw err;

  });

};

module.exports = TemplateLoader;