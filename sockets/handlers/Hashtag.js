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
    var currentSpace = nsp;
    var currentSocket = socket;

    // Expose handler methods for events
    this.handler = {

        'hashtags:submit': function(package) {

            console.log("HashtagSubmitted", package.msgData)

            GET_SESSION(package.gameId).
            HashtagSubmitted(
                                currentSocket.id,
                                package.msgData,
                                currentSpace
                            );

        },

        'hashtag:vote': function(package) {

            GET_SESSION(package.gameId).
            HashtagVote(
                            currentSocket.id,
                            package.msgData,
                            currentSpace
                        );

        }
    
    };
}

module.exports = Hashtag;