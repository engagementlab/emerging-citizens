module.exports = function(app) {

  var events = require('events');
  var EventEmitter = new events.EventEmitter();

  var io = require('socket.io')(app);

  var GameManager = require('../lib/GameManager')(EventEmitter),
      TemplateLoader = new require('../lib/TemplateLoader');

  var Hashtag = require('./handlers/Hashtag');
  var PlayerLogin = require('./handlers/PlayerLogin');

  var hashTagSpace = io.of('/hashtag-youre-it');

  hashTagSpace.on('connection', function (socket) {

    // Create event handlers for this socket
    var eventHandlers = {
        hashtag: new Hashtag(hashTagSpace, socket),
        login: new PlayerLogin(hashTagSpace, socket, EventEmitter)
    };

    // Bind events to handlers
    for (var category in eventHandlers) {
        var handler = eventHandlers[category].handler;
        for (var event in handler) {
            socket.on(event, handler[event]);
        }
    }

  });


  EventEmitter.on('gameReady', function() {

      require('../lib/Tweet')(function(data) {

        TemplateLoader('index/tweet', data, function(html) {
          hashTagSpace.to('lobby').emit('game:start', html);
        });
      
      });

  });

  console.log('emerging-citizens: socket.io inititalized');

};