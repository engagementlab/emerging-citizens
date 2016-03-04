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


var redis = require("redis").createClient(),
    _ = require('underscore'),
    users = [];

var currentSpace;
var currentSocket;

var _playerGameId;

var EventEmitter;

redis.on("error", function (err) {
  console.log("Error " + err);
});

var PlayerLogin = function (nsp, socket, emitter) {

    currentSpace = nsp;
    currentSocket = socket;
    EventEmitter = emitter;

    // Expose handler methods for events
    this.handler = {
      'login:submit': submitted.bind(this),
      disconnect: disconnected.bind(this),
      getUsers: getUsers.bind(this)
    };

};

// Events
function submitted(package) {

  var user = {id: currentSocket.id, username: package.msgData.username};

  currentSocket.join(package.gameId, function(err) {

    if(err)
      throw err;

    _playerGameId = package.gameId;

    GET_SESSION(package.gameId).PlayerReady(user, currentSpace);

    console.log(user.username  + ' logged in.');
    
  });

};


function disconnected() {

  if(_playerGameId !== undefined)
    GET_SESSION(_playerGameId).PlayerLost(currentSocket.id, currentSpace);

};

function getUsers() {

  redis.get('ec_users', function (err, users) {

    console.log('getUsers')

    currentSocket.emit('user:update', JSON.parse(users));

  });

};

module.exports = PlayerLogin;