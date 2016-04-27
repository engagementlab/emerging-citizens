/**
 * Emerging Citizens
 * Developed by Engagement Lab, 2015
 * ==============
 * Game player view controller.
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
var GameSession = keystone.list('GameSession');

exports = module.exports = function(req, res) {

    var view = new keystone.View(req, res);
    var locals = res.locals;
    locals.game_not_found = false;

    // locals.section is used to set the currently selected
    // item in the header navigation.
    locals.section = 'player';

    view.on('init', function(next) {

        GameSession.model.findOne({ accessCode: req.params.accesscode.toLowerCase() }, function (err, game) {

            if(game === null) 
                locals.game_not_found = true;
            else
                locals.game = game;

            next(err);

        });

	  });

    // Render the view
    view.render('game/player');

};
