/**
 * Emerging Citizens
 * Developed by Engagement Lab, 2016
 * ==============
 * Wiki submission socket handler.
 *
 * @class sockets/handlers
 * @static
 * @author Johnny Richardson
 *
 * ==========
 */

var Wiki = function (nsp, socket) {
    var currentSpace = nsp,
        currentSocket = socket, 
        appRoot = require('app-root-path'),
        Session = require(appRoot + '/lib/SessionManager');

    // Expose handler methods for events
    this.handler = {

        'wikis:submit': function(package) {

            Session.Get(package.gameId).
            WikiSubmitted(
                                currentSocket.id,
                                package.msgData,
                                currentSocket,
                                currentSpace
                            );

        },

        // 'wiki:vote': function(package) {

        //     Session.Get(package.gameId).
        //     WikiVote(
        //                     currentSocket.id,
        //                     package.msgData,
        //                     currentSpace
        //                 );

        // },

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

        },

        'articles:search': function(package) {

            Session.Get(package.gameId).
            SearchArticles(currentSocket, package.msgData);

        }
    
    };
}

module.exports = Wiki;