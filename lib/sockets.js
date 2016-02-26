module.exports = function(server) {

  // this will be called after the file is read
  function renderToString(source, data) {
    var template = handlebars.compile(source);
    var outputString = template(data);
    return outputString;
  }

  var io = require('socket.io')(server);
  var fs = require('fs');
  var handlebars = require('handlebars');
  var rootDir = require('app-root-path');

  var players = [];

  io.on('connection', function(socket) {
    
    console.log('joined', socket.id);

    players.push(socket.id);

      // read the file and use the callback to render
      fs.readFile(rootDir + '/templates/partials/index/player.hbs', function(err, data){
        if (!err) {
          // make the buffer into a string
          var source = data.toString();
          // call the render function
          var msg = renderToString(source, {name: 'a player'});
          io.emit('new player', {html: msg, count: players.length});
        } else {
          throw err;
          // handle file read error
        }
      });

    socket.on('chat message', function(msg){
        
    });

    socket.on('disconnect', function () {

      console.log('left', socket.id);

      players.splice(players.indexOf(socket.id));
      io.emit('user disconnected', {count: players.length});

    });
  
  });

  console.log('emerging-citizens: socket.io inititalized');

  return io.sockets;

};