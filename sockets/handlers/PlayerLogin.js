/**
 * Emerging Citizens
 * Developed by Engagement Lab, 2016
 * ==============
 * PlayerLogin submission socket handler.
 *
 * @class sockets/handlers
 * @static
 * @author Johnny Richardson
 *
 * ==========
 */


var _ = require('underscore'),
    appRoot = require('app-root-path'),
    logger = require('winston'),
    colors = require('colors'),

    Session = require(appRoot + '/lib/SessionManager');

var PlayerLogin = function (nsp, socket, emitter) {

  var currentSpace;
  var currentSocket;

  var playerGameId;

  currentSpace = nsp;
  currentSocket = socket;

  // Expose handler methods for events
  this.handler = {

    room: function(package) {

      // If '-moderator' specified as room affix, remove for game id
      if(package.gameId.indexOf('-moderator') !== -1)
          playerGameId = package.gameId.replace('-moderator', '');
      else
        playerGameId = package.gameId;
      
      if(Session.Get(playerGameId) === undefined) {
        currentSocket.emit('game:notfound');
        return;
      }

      currentSocket.join(package.gameId, function(err) {

        if(err)
          throw err;
      });

      if(package.msgData == 'moderator') {

        Session.Moderate(package.gameId, currentSocket.id);
        Session.Get(playerGameId).ModeratorJoin(currentSpace);

      }
        
      logger.info(currentSocket.id + ' connected to room.');

    },
    
    'login:submit': function(package) {

      var user = {id: currentSocket.id, username: package.msgData.username};

      // Advance player to waiting screen
      Templates.Load('partials/player/waiting', undefined, function(html) {
        currentSocket.emit('players:update', html);
      });

      // Mark player as ready inside game session
      Session.Get(package.gameId).PlayerReady(user, currentSpace);

      logger.info(user.username  + ' logged in.');

      // Send player's id (debugging)
      currentSocket.emit('player:id', currentSocket.id);
      
    },

    disconnect: function(package) {

      logger.info("Player '" + currentSocket.id + "' disconnecting.");

      if(Session.Get(playerGameId) === undefined)
        return;

      var session = Session.Get(playerGameId);

      if(playerGameId !== undefined && session !== undefined) {
        session.PlayerLost(currentSocket.id, currentSpace);

        if(currentSocket.id === Session.Get(playerGameId).moderator) {
          logger.debug('is moderator')
          session.End(currentSpace);
        }

      }
    },

    error: function(err) {
    
      console.error('socket error!', err);

    }
  
  };

  logger.info("New PlayerLogin for socket: ".green + currentSocket.id);

};
module.exports = PlayerLogin;