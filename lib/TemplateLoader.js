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
var handlebars = require('keystone').get('handlebars');
var rootDir = require('app-root-path');

// // this will be called after the file is read
// function renderToString(source, data) {

//   var template = handlebars.load(source);

//   var outputString = template(data);
//   return outputString;
// }

module.exports = {

  Load: function(filePath, data, callback) {

    console.log(handlebars.render)

    handlebars
    .render(rootDir + '/templates/partials/' + filePath + '.hbs', data)
    .then(function(res) {
      
        callback(res);

    });

  }

};