module.exports = function(app) {

  // this will be called after the file is read
  function renderToString(source, data) {
    var template = handlebars.compile(source);
    var outputString = template(data);
    return outputString;
  }

  var io = require('socket.io')(app);

  var Hashtag = require('./handlers/Hashtag');

  var fs = require('fs');
  var handlebars = require('handlebars');
  var _ = require('underscore');
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

  var hashTagSpace = io.of('/hashtag-youre-it');

  hashTagSpace.on('connection', function (socket) {
    
    // console.log('joined', socket.id);

    // once a client has connected, we expect to get a ping from them saying what room they want to join
    socket.on('room', function(room) {

      socket.join(room, function(err) {
        users.push(socket.id);
        console.log(users)
        redisCli.set("users", users.join(';'), redis.print);

        socket.emit('user:update', users);
      });
    
    });

    socket.on('getUsers', function() {

      socket.emit('user:update', users);
    
    });
    
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

      console.log(users)
      console.log('=========')

      users = _.reject(users, function(user) { 
        return user === socket.id; 
      });
      console.log(users)


      redisCli.set("users", users.join(';'), redis.print); 

      socket.emit('user:update', users);

    });

    // Create event handlers for this socket
    var eventHandlers = {
        hashtag: new Hashtag(hashTagSpace, socket)
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