var Chat = function (app, socket) {
    this.app = app;
    this.socket = socket;

    // Expose handler methods for events
    this.handler = {
        message: message.bind(this), // use the bind function to access this.app
        helloworld:    helloworld.bind(this)    // and this.socket in events
    };
}

// Events

function message(text) {
    // Broadcast message to all sockets
    this.app.emit('message', text);
};

function helloworld() {
    console.log("***PING***", this.socket.id)
    // Reply to sender
    this.socket.emit('message', 'PONG!');
};

module.exports = Chat;