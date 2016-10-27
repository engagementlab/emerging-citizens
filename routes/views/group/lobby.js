'use strict';
/**
 * Emerging Citizens
 * Developed by Engagement Lab, 2016
 * ==============
 * Moderator view controller.
 *
 * Help: http://keystonejs.com/docs/getting-started/#routesviews-firstview
 *
 * @class group
 * @static
 * @author Johnny Richardson
 *
 * ==========
 */
var keystone = require('keystone'),
  appRoot = require('app-root-path'),
  GameSession = keystone.list('GameSession');

var GameManager = require(appRoot + '/lib/GameManager'),
    Session = require('learning-games-core').SessionManager;
    
exports = module.exports = function(req, res) {

  var view = new keystone.View(req, res);
  var locals = res.locals;

  // locals.section is used to set the currently selected
  // item in the header navigation.
  locals.viewType = 'group';
  locals.section = 'monitor';

  // Enable debugging on staging/dev only
  if(req.params.debug === 'debug' && process.env.NODE_ENV !== 'production')
    locals.debug = true;

  view.on('init', function(next) {

    GameSession.model.findOne({accessCode: req.params.accesscode.toUpperCase()}, function (err, game) {

        if(!game) {
          console.log("Game with ID '" + req.params.accesscode.toUpperCase() + "' not found!");
          locals.viewType = 'landing'; 
          return res.notfound('Game not found!', 'Sorry, but it looks like this game session does not exist! Try going back <a href="/">home</a>.');  
        }

        // If session does not exist, create it; otherwise, flag current one as restarting
    		let sesh = Session.Get(game.accessCode);
        if(!sesh)
    			Session.Create(game.accessCode, new GameManager(game));
        else
          sesh.SetToRestarting();

        locals.accessCodeSplit = game.accessCode.split('');

        // Set local for this view only
        locals.gameType = game.gameType;
        locals.game = game;

        locals.players = {left: [1, 2, 3, 4], right: [5, 6, 7, 8]};

        next();

    });

  });

  // Render the view
  view.render('group/lobby');

};
