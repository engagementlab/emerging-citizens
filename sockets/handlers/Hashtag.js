var Hashtag = function (nsp, socket) {
    this.nsp = nsp;
    this.socket = socket;

    // Expose handler methods for events
    this.handler = {
        hashtagSubmitted: submitted.bind(this)    // and this.socket in events
    };
}

// Events

function submitted(text) {

    this.nsp.in('lobby').emit('hashtagReceived', {hashtag: text, user: this.socket.id});

};

module.exports = Hashtag;