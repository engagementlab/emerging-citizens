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
    var currentSpace = nsp,
        currentSocket = socket, 
        appRoot = require('app-root-path'),
        Session = require(appRoot + '/lib/SessionManager');

    // Expose handler methods for events
    this.handler = {

        'hashtags:submit': function(package) {

            Session.Get(package.gameId).
            HashtagSubmitted(
                                currentSocket.id,
                                package.msgData,
                                currentSocket,
                                currentSpace
                            );
            console.log (package, "HashtagSubmitted");

        },

        'hashtag:vote': function(package) {

            Session.Get(package.gameId).
            HashtagVote(
                            currentSocket.id,
                            package.msgData,
                            currentSpace
                        );

        },

        'game:tutorial': function(package) {

            Session.Get(package.gameId).
            StartTutorial(currentSpace);

        },

        'game:start': function(package) {

            Session.Get(package.gameId).
            StartGame(currentSpace);

        },

        'game:next_round': function(package) {

            Session.Get(package.gameId).
            AdvanceRound(currentSpace);

        }
    
    };
}

module.exports = Hashtag;