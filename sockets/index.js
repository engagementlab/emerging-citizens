module.exports = function(app) {

  var events = require('events');
  var EventEmitter = new events.EventEmitter();

  var io = require('socket.io')(app);

  var GameManager = require('../lib/GameManager');

  var HashtagHandler = require('./handlers/Hashtag');
  var PlayerLogin = require('./handlers/PlayerLogin');

  io.on('connection', function (socket) {

    // Create event handlers for this socket
    var eventHandlers = {
        hashtag: new HashtagHandler(io, socket),
        login: new PlayerLogin(io, socket, EventEmitter)
    };

    // Bind events to handlers
    for (var category in eventHandlers) {
        var handler = eventHandlers[category].handler;
        for (var event in handler) {
            socket.on(event, handler[event]);
        }
    }

  });

  console.log('emerging-citizens: socket.io inititalized');

};