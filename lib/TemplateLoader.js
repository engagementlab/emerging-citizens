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

module.exports = {

  Load: function(filePath, data, callback) {

    handlebars
    .render(rootDir + '/templates/partials/' + filePath + '.hbs', data)
    .then(function(res) {
      
        callback(res);

    })
    .catch(function(err) {

    	console.error("TemplateLoader ERROR", err);
    
    });

  }

};