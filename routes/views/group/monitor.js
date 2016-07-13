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
var keystone = require('keystone')
  appRoot = require('app-root-path'),
  GameSession = keystone.list('GameSession');

var GameManager = require(appRoot + '/lib/GameManager'), 
    Session = require(appRoot + '/lib/SessionManager');
    
exports = module.exports = function(req, res) {

  var view = new keystone.View(req, res);
  var locals = res.locals;

  // locals.section is used to set the currently selected
  // item in the header navigation.
  locals.section = 'group/monitor';

  // Enable debugging on staging only
  if(req.params.debug === 'debug' && process.env.NODE_ENV !== 'production')
    locals.debug = true;

  view.on('init', function(next) {

    GameSession.model.findOne({accessCode: req.params.accesscode.toUpperCase()}, function (err, game) {

        if(game === null) {
          console.log("Game with ID '" + req.params.accesscode.toUpperCase() + "' not found!");
          return res.notfound('Game not found!', 'Sorry, but it looks like this game session does not exist!');  
        }

    		// TODO: Dev only?
    		if(Session.Get(game.accessCode) === undefined)
    			Session.Create(game.accessCode, new GameManager(game));

        locals.accessCodeSplit = game.accessCode.split('');

        // Set global game type
        gameType = game.gameType;
        console.log (game.gameType);

        // Set local for this view only
        locals.gameType = gameType;
        locals.game = game;

        locals.players = {left: [1, 2, 3, 4], right: [5, 6, 7, 8]};

        next();

    });

  });

  // Render the view
  // console.log (gameType);
  view.render('group/monitor');

};
