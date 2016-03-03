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

var currentSpace;
var currentSocket;

var Hashtag = function (nsp, socket) {
    currentSpace = nsp;
    currentSocket = socket;

    // Expose handler methods for events
    this.handler = {
        hashtagSubmitted: submitted.bind(this)    // and this.socket in events
    };
}

// Events

function submitted(package) {

    GET_SESSION(package.gameId).
    HashtagSubmitted(
											currentSocket.id,
											currentSpace,
											package.data
										);

};

module.exports = Hashtag;