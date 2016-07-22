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
        
        'articles:search': function(package) {

            Session.Get(package.gameId).
            SearchArticles(currentSocket, package.msgData);

        },

        'article:select': function(package) {
            console.log (package, "package");
            Session.Get(package.gameId).
            PlayerClick(currentSocket.id, package.msgData.title, package.msgData.initial);

        },

        // Debugging
        'game:force_results': function(package) {

            Session.Get(package.gameId).
            ForceResults();

        }
    
    };
}

module.exports = Wiki;