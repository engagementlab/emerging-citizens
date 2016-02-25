module.exports = function(server) {

    console.log(server)

    var io = require('socket.io')(server);

    io.on('connection', function(socket){
      console.log('joined', 'user joined');
      
      socket.on('chat message', function(msg){
        console.log('message: ' + msg);
      });
      socket.on('chat message', function(msg){
        io.emit('chat message', msg);
      });
    });
};