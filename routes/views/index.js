/**
 * Emerging Citizens
 * Developed by Engagement Lab, 2016
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
var keystone = require('keystone'),
    HomePage = keystone.list('HomePage');

exports = module.exports = function(req, res) {

    var view = new keystone.View(req, res);
    var locals = res.locals;

    view.on('init', function(next) {

      var queryHomePage = HomePage.model.findOne({}, {}, {
        sort: {
            'createdAt': -1
        }
      });

      // If game is enabled, get home page content
      queryHomePage.exec(function (err, resultHomePage) {
      
        locals.content = resultHomePage;
        locals.viewType = 'landing';
        locals.section = 'index';
        
        next(err);

      });     

    });

    view.render('index');

};