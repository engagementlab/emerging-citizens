/**
 * Emerging Citizens
 * Developed by Engagement Lab, 2015
 * ==============
 * Game entry view controller.
 *
 * Help: http://keystonejs.com/docs/getting-started/#routesviews-firstview
 *
 * @class game
 * @static
 * @author Johnny Richardson
 *
 * ==========
 */
var keystone = require('keystone');
var _ = require('underscore');
var Tweet = keystone.list('Tweet');
var _twitter = keystone.get('twitter');
var GameSession = require(require('app-root-path') + '/models/GameSession');

exports = module.exports = function(req, res) {

    var view = new keystone.View(req, res);
    var locals = res.locals;

    // locals.section is used to set the currently selected
    // item in the header navigation.
    locals.section = 'home';

    view.on('init', function(next) {

        GameSession.findOne({accessCode: req.params.accesscode}, function (err, game) {

            locals.game = game;

            next(err);

        });

/*    	var queryTweet = Tweet.model.findOne({}, {}, {
            sort: {
                'createdAt': -1
            }
        });

        queryTweet.exec(function(err, tweet) {

        	_twitter.get('statuses/lookup', {id: '695343359607468034'}, function(err, tweets, response) {
                
	          if (err) throw error;

	        	locals.tweet = tweets[0].text.substring(0, tweets[0].text.indexOf('#'));
	          
	          next(err);

          });

        });*/

	  });

    // Render the view
    view.render('game/entry');

};
