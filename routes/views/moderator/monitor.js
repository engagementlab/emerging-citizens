/**
 * Emerging Citizens
 * Developed by Engagement Lab, 2016
 * ==============
 * Moderator view controller.
 *
 * Help: http://keystonejs.com/docs/getting-started/#routesviews-firstview
 *
 * @class moderator
 * @static
 * @author Johnny Richardson
 *
 * ==========
 */
var keystone = require('keystone'),
	_ = require('underscore'),
  appRoot = require('app-root-path'),
  GameSession = keystone.list('GameSession');

var GameManager = require(appRoot + '/lib/GameManager');

exports = module.exports = function(req, res) {

  var view = new keystone.View(req, res);
  var locals = res.locals;

  // locals.section is used to set the currently selected
  // item in the header navigation.
  locals.section = 'moderator/monitor';

  view.on('init', function(next) {

    GameSession.model.findOne({accessCode: req.params.accesscode}, function (err, game) {

    		// TODO: Dev only?
    		if(GET_SESSION(game.accessCode) === undefined)
    			CREATE_SESSION(game.accessCode, new GameManager(game));

        locals.game = game;

        next();

    });

  });

  // Render the view
  view.render('moderator/monitor');

};
