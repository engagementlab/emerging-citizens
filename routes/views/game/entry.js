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
var GameSession = keystone.list('GameSession');

exports = module.exports = function(req, res) {

    var view = new keystone.View(req, res);
    var locals = res.locals;

    // locals.section is used to set the currently selected
    // item in the header navigation.
    locals.section = 'home';

    view.on('init', function(next) {

        GameSession.model.findOne({accessCode: req.params.accesscode}, function (err, game) {

            locals.game = game;

            next(err);

        });

	  });

    // Render the view
    view.render('game/entry');

};
