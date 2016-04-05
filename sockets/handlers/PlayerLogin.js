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
        
      console.log(currentSocket.id + ' connected to room.');

    },
    
    'login:submit': function(package) {

      var user = {id: currentSocket.id, username: package.msgData.username};

      Session.Get(package.gameId).PlayerReady(user, currentSpace);

      console.log(user.username  + ' logged in.');

    },

    disconnect: function(package) {

      var session = Session.Get(playerGameId);

      if(playerGameId !== undefined && session !== undefined) {
        session.PlayerLost(currentSocket.id, currentSpace);

        if(currentSocket.id === Session.Get(playerGameId).moderator) {
          console.log('is moderator')
          session.End(currentSpace);
        }

      }
    },

    error: function(err) {
    
      console.error('socket error!', err);

    }
  
  };

  console.log("New PlayerLogin for socket: " + currentSocket.id);

};
module.exports = PlayerLogin;