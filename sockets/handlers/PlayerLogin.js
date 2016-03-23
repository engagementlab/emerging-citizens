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
    users = [];

var PlayerLogin = function (nsp, socket, emitter) {

  var currentSpace;
  var currentSocket;

  var playerGameId;
  var isModerator;

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
      
      if(GET_SESSION(playerGameId) === undefined) {
        currentSocket.emit('game:notfound');
        return;
      }

      currentSocket.join(package.gameId, function(err) {

        if(err)
          throw err;
      });

      isModerator = package.msgData == 'moderator';
        
      console.log(currentSocket.id + ' connected to room.');

    },
    
    'login:submit': function(package) {

      var user = {id: currentSocket.id, username: package.msgData.username};

      GET_SESSION(package.gameId).PlayerReady(user, currentSpace);

      console.log(user.username  + ' logged in.');

    },

    disconnect: function(package) {

      var session = GET_SESSION(playerGameId);

      if(playerGameId !== undefined && session !== undefined) {
        session.PlayerLost(currentSocket.id, currentSpace);

        if(isModerator) {
          console.log('is moderator')
          session.End(currentSpace);
        }

      }
    }
  
  };

  console.log("New PlayerLogin for socket: " + currentSocket.id);

};
module.exports = PlayerLogin;