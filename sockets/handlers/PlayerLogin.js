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
      loginSubmit: submitted.bind(this),
      disconnect: disconnected.bind(this),
      getUsers: getUsers.bind(this)
    };

};

// Events
function submitted(msg) {

  var user = {id: currentSocket.id, username: msg.username};


  currentSocket.join(msg.room, function(err) {

    users.push(user);

    redis.set('ec_users', JSON.stringify(users));

    // currentSocket.emit('user:joined');
    currentSpace.emit('user:update', users);

    if(users.length == 1) {
      EventEmitter.emit('gameReady');
    }

  });

};


function disconnected() {

  redis.get('ec_users', function (err, users) {

    console.log('left', currentSocket.id);

    var updatedUsers = _.reject(JSON.parse(users), function(user) {

      return user.id === currentSocket.id; 
    
    });

   redis.set('ec_users', JSON.stringify(updatedUsers), redis.print);

    currentSpace.emit('user:update', updatedUsers);

  });

};

function getUsers() {

  redis.get('ec_users', function (err, users) {

    console.log('getUsers')

    currentSocket.emit('user:update', JSON.parse(users));

  });

};

module.exports = PlayerLogin;