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
    this.currentSpace = nsp;
    this.currentSocket = socket;

    console.log("socket", socket.id)

    // Expose handler methods for events
    this.handler = {
        'hashtags:submit': submitted.bind(this)    // and this.socket in events
    };
}

// Events

function submitted(package) {

    GET_SESSION(package.gameId).
    HashtagSubmitted(
											this.currentSocket.id,
											package.msgData,
											this.currentSpace
										);

};

module.exports = Hashtag;