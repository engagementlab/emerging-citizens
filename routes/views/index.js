/**
 * Engagement Lab Website
 * Developed by Engagement Lab, 2015
 * ==============
 * Home page view controller.
 *
 * Help: http://keystonejs.com/docs/getting-started/#routesviews-firstview
 *
 * @class index
 * @static
 * @author Johnny Richardson
 *
 * ==========
 */
var keystone = require('keystone');
var _ = require('underscore');
var rootDir = require('app-root-path')


    // console.log(keystone)
// console.trace()
exports = module.exports = function(req, res) {
var sockets = require(rootDir + '/lib/sockets')(req.app.server);

    var view = new keystone.View(req, res);
    var locals = res.locals;

    // locals.section is used to set the currently selected
    // item in the header navigation.
    locals.section = 'home';

  /*  view.on('init', function(next) {

	  });*/

    // Render the view
    view.render('index');

};
