/**
 * Emerging Citizens
 * Developed by Engagement Lab, 2016
 * ==============
 * Hashtag submission socket handler.
 *
 * @class sockets/handlers
 * @static
 * @author Johnny Richardson
 *
 * ==========
 */

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