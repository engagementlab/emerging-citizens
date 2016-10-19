/**
 * Emerging Citizens
 * Developed by Engagement Lab, 2016
 * ==============
 * Common game socket handler.
 *
 * @class sockets/handlers
 * @static
 * @author Johnny Richardson
 *
 * ==========
 */

var Common = function (nsp, socket) {
    var currentSpace = nsp,
        currentSocket = socket, 
        Session = require('learning-games-core').SessionManager;

    // Expose handler methods for events
    this.handler = {

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

        'game:show_survey': function(package) {

            Session.Get(package.gameId).
            DisplaySurvey(currentSpace);

        },

        /* Pauses all game cooldowns (debugging only) */
        'debug:pause': function(package) {

            Session.Get(package.gameId).
            PauseResumeCooldown();

        }
    
    };
}

module.exports = Common;