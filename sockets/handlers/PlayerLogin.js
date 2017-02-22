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
    Core = require('learning-games-core'),
    Session = Core.SessionManager,
    TemplateLoader = Core.TemplateLoader;

var PlayerLogin = function (nsp, socket, emitter) {

  var Templates = new TemplateLoader(undefined, require('keystone'), require('app-root-path'));

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
          
          Templates.Load('partials/player/gamenotfound', undefined, function(html) {
            currentSocket.emit('game:notfound', html);
          });
          
          return;
        }
      }
  
      currentSocket.join(package.gameId, function(err) {
        if(err)
          throw err;
      });

      // Is moderator starting game?
      if(package.msgData == 'moderator' && Session.Get(playerGameId)) {

        Session.GroupView(package.gameId, currentSocket.id);
        Session.Get(playerGameId).ModeratorJoin(currentSpace);
      }


        
      logger.info(currentSocket.id + ' connected to room.');

    },
    
    'login:submit': function(package) {


      // Handle server load testing where no uid sent
      if(!package.msgData.uid)
        package.msgData.uid = Math.floor(Math.pow(10, 10-1) + Math.random() * (Math.pow(10, 10) - Math.pow(10, 10-1) - 1));


      if (Session.Get(package.gameId).IsFull()) {
        console.log("game is full");
        currentSocket.emit('game:error', "Uh oh! Looks like this game is full...");
        return;
      }

      var player = {socket_id: currentSocket.id, username: package.msgData.username, uid: package.msgData.uid};

      // Mark player as ready inside game session
      var session = Session.Get(package.gameId);
      // console.log(session);
      if(session) session.PlayerReady(player, currentSpace);
      else return;

      logger.info(player.username  + ' logged in.');
      
      // Advance player to waiting screen
      Templates.Load('partials/player/waiting', undefined, function(html) {

        if(!Session.Get(package.gameId))
          return;

        var data = {
                    id: currentSocket.id,
                    html: html,
                    gameType: Session.Get(package.gameId).GetGameType(), 
                    gameCode: package.gameId
                   };

        currentSocket.emit('player:loggedin', data);
      
      });
      
    },
    
    'login:active': function(package) {

      // STOP and tell player game not found?
      if(!Session.Get(package.gameId)) {
        Templates.Load('partials/player/gamenotfound', undefined, function(html) {
          currentSocket.emit('game:notfound', html);
        });

        return;
      }

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
        
        Templates.Load('partials/player/playerinactive', undefined, function(html) {
          currentSocket.emit('player:inactive', html);
        });
      }
      
    },

    disconnect: function(package) {

      // console.log(package);

      var session = Session.Get(playerGameId);

      logger.info(playerGameId + " lost because of " + package);

      if(!session)
        return;

      var isGroup = (currentSocket.id === session.groupModerator);

      if(isGroup) {
        logger.info(playerGameId + " group view disconnecting. Bu-bye.");
      } else {

        var player = session.GetPlayerById(currentSocket.id);

        if(player)
          logger.info("Player '" + player.username + "' disconnecting. Nooooo!");

      }

      if(playerGameId && session) {

        // End game is moderator left
        if(currentSocket.id === session.groupModerator)
          session.End(currentSpace, true);
        else
          session.PlayerLost(currentSocket.id);

      }
    }
  
  };

  logger.info("New PlayerLogin for socket: ".green + currentSocket.id);

};
module.exports = PlayerLogin;