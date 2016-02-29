module.exports = function(app) {

  // this will be called after the file is read
  function renderToString(source, data) {
    var template = handlebars.compile(source);
    var outputString = template(data);
    return outputString;
  }

  var io = require('socket.io')(server);

  var Chat = require('./handlers/Chat');

  var fs = require('fs');
  var handlebars = require('handlebars');
  var rootDir = require('app-root-path');


  var redis = require("redis"),
      redisCli = redis.createClient(),
      users = [];
  
  redisCli.on("error", function (err) {
    console.log("Error " + err);
  });

  /*io.on('connection', function(socket) {
    
    console.log('joined', socket.id);

    players.push(socket.id);

      // read the file and use the callback to render
     

    socket.on('chat message', function(msg){
        
    });
  
  });*/

  io.on('connection', function (socket) {
    
    console.log('joined', socket.id);

    users.push(socket.id);

    redisCli.set("users", users.join(';'), redis.print);

    io.sockets.in('lobby').emit('joined', {playerId: socket.id});

    /*fs.readFile(rootDir + '/templates/partials/index/player.hbs', function(err, data) {
      
      if (!err) {
        // make the buffer into a string
        var source = data.toString();
        // call the render function
        // var msg = renderToString(source, {name: 'player # ' + socket.id});
      } else {
        throw err;
        // handle file read error
      }

    });*/

    socket.on('disconnect', function () {

      console.log('left', socket.id);

      users.splice(users.indexOf(socket.id));
      redisCli.set("users", users.join(';'), redis.print); 

    });

    // Create event handlers for this socket
    var eventHandlers = {
        chat: new Chat(io, socket)
    };

    // Bind events to handlers
    for (var category in eventHandlers) {
        var handler = eventHandlers[category].handler;
        for (var event in handler) {
            socket.on(event, handler[event]);
        }
    }

    // Keep track of the socket
    // socketHandle.allSockets.push(socket);
  });

  console.log('emerging-citizens: socket.io inititalized');

};