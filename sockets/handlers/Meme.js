/**
 * Emerging Citizens
 * Developed by Engagement Lab, 2016
 * ==============
 * WWDMM socket handler.
 *
 * @class sockets/handlers
 * @static
 * @author Johnny Richardson
 *
 * ==========
 */

var Meme = function (nsp, socket) {
    var currentSpace = nsp,
        currentSocket = socket, 
        appRoot = require('app-root-path'),
        Session = require(appRoot + '/lib/SessionManager');

    // Expose handler methods for events
    this.handler = {

        'meme:submit': function(package) {
            
            Session.Get(package.gameId).
            MemeSubmitted(
                            currentSocket.id,
                            package.msgData,
                            currentSocket
                         );


        },

        'meme:vote': function(package) {
            
            Session.Get(package.gameId).
            MemeVote(
                        currentSocket.id,
                        package.msgData,
                        currentSocket
                     );


        },

        'meme:like': function(package) {
            
            Session.Get(package.gameId).
            MemeLike(
                        currentSocket.id,
                        package.msgData,
                        currentSocket
                     );


        },

        // Debugging
        'game:force_results': function(package) {

            Session.Get(package.gameId).
            DisplayResults();

        }
    
    };
}

module.exports = Meme;