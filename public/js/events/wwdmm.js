/**
 * Emerging Citizens
 * Developed by Engagement Lab, 2016
 * ==============
 * 
 * Script for PLAYERS' WWDMM socket events. Loaded to client upon successful login.
 * ==========
 */

var playerWasReconnected;

window.addEventListener("beforeunload", function (e) {
  (e || window.event).returnValue = null;
  return null;

});

// Add game type class to body
$('.body').addClass('wwdmm');

var gameEvents = function(eventId, eventData) {

    switch (eventId) {

        case 'game:start':

          break;

        case 'player:reconnected':

            playerWasReconnected = true;

          break;

    }

};