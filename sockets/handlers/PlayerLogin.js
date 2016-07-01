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


var appRoot = require('app-root-path'),
    logger = require('winston'),
    colors = require('colors'),

    TemplateLoader = require(appRoot + '/lib/TemplateLoader'),
    Session = require(appRoot + '/lib/SessionManager');
    Common = require(appRoot + '/lib/games/Common');

var PlayerLogin = function (nsp, socket, emitter) {

  var Templates = new TemplateLoader();

  var currentSpace;
  var currentSocket;

  var playerGameId;

  currentSpace = nsp;
  currentSocket = socket;

  // Expose handler methods for events
  this.handler = {

    room: function(package) {
      if(package.gameId === null) {
        console.warn('gameId missing for socket ID "' + currentSocket.id + '"!');
        return;
      }

      // If '-group' specified as room affix, remove for game id
      if(package.gameId.indexOf('-group') !== -1)
          playerGameId = package.gameId.replace('-group', '');
      else {
        playerGameId = package.gameId;
  
        if(!Session.Get(playerGameId)) {
          currentSocket.emit('game:notfound');
          return;
        }
      }
  
      currentSocket.join(package.gameId, function(err) {

        if(err)
          throw err;
      });

      if(package.msgData == 'moderator' && Session.Get(playerGameId)) {

        Session.GroupView(package.gameId, currentSocket.id);
        Session.Get(playerGameId).ModeratorJoin(currentSpace);
      }
        
      logger.info(currentSocket.id + ' connected to room.');

    },
    
    'login:submit': function(package) {

      var player = {socket_id: currentSocket.id, username: package.msgData.username, uid: package.msgData.uid};

      // Mark player as ready inside game session
      Session.Get(package.gameId).PlayerReady(player, currentSpace);

      logger.info(player.username  + ' logged in.');
      
      // Advance player to waiting screen
      Templates.Load('partials/player/waiting', undefined, function(html) {
        var data = {
                    id: currentSocket.id,
                    html: html,
                    gameType: Session.Get(package.gameId).GetGameType()
                   };

        currentSocket.emit('player:loggedin', data);
      });

      // Send player's id (debugging)
      // currentSocket.emit('player:id', );
      
    },
    
    'login:active': function(package) {

      if(Session.Get(package.gameId) === undefined)
        return;

      logger.info('login:active', 'Checking if player "' + package.uid + '" is active.');

      // See if this player is still marked as active inside game session
      if(Session.Get(package.gameId).PlayerIsActive(package.uid)) {

        var player = {socket_id: currentSocket.id, username: package.username, uid: package.uid};

        // Set client to reconnected state
        currentSocket.emit('player:reconnected', true);

        // Mark player as ready inside game session
        Session.Get(package.gameId).PlayerReady(player, currentSocket);

      }
      else {
        logger.info('login:active', 'Player "' + package.uid + '" not active.');
      }
      
    },


    disconnect: function(package) {

      logger.info("Player '" + currentSocket.id + "' disconnecting.");

      var session = Session.Get(playerGameId);

      if(!session)
        return;

      if(playerGameId) {
        // session.PlayerLost(currentSocket.id, currentSpace);

        if(currentSocket.id === session.groupModerator) {
          logger.debug('is group moderator');
          session.End(currentSpace, true);
        }

      }
    }
  
  };

  logger.info("New PlayerLogin for socket: ".green + currentSocket.id);

};
module.exports = PlayerLogin;