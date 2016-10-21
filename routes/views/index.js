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
    HomePage = keystone.list('HomePage'),
    ComingSoon = keystone.list('ComingSoon'),
    WhatIs = keystone.list('WhatIs');

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

    var queryComingSoon = ComingSoon.model.findOne({}, {}, {
      sort: {
          'createdAt': -1
      }
    });

    queryConfig.exec(function(err, resultConfig) {

    	if(resultConfig.enabled) {

		  	// If game is enabled, get home page content
		    queryHomePage.exec(function (err, resultHomePage) {
		    
		    	locals.content = resultHomePage;
			    locals.viewType = 'landing';
          locals.section = 'index';

          // console.log(locals.content)

          WhatIs.model.findOne({}, {}, function (err, what) {
            locals.what = what;

            // Render the view
            view.render('index');
          });
				  
				  
			    

			  });
			  
		  }
		  else {

		  	// If game is not enabled, get coming soon content
		    queryComingSoon.exec(function (err, resultComingSoon) {

		    	locals.content = resultComingSoon;
			    locals.viewType = 'landing';
          locals.section = 'comingsoon';

			    // Render the view
			    view.render('comingsoon');

			  });
		  }

    });


};
