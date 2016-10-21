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
    GameConfig = keystone.list('GameConfig'),
    HomePage = keystone.list('HomePage');
exports = module.exports = function(req, res) {

    var view = new keystone.View(req, res);
    var locals = res.locals;

		// Query to get current game config data
    var queryConfig = GameConfig.model.findOne({}, {}, {
      sort: {
          'createdAt': -1
      }
    });

    var queryHomePage = HomePage.model.findOne({}, {}, {
      sort: {
          'createdAt': -1
      }
    });

    queryConfig.exec(function(err, resultConfig) {

		  	// If game is enabled, get home page content
		    queryHomePage.exec(function (err, resultHomePage) {
		    
		    	locals.content = resultHomePage;
			    locals.viewType = 'landing';
          locals.section = 'index';
			    

			  });		  

    });


};
