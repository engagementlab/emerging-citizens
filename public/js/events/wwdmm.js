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

    /*
	    Catch socket events -- MAKE SURE ALL EVENT IDS ARE IN global.hbs
    */
    switch (eventId) {

    	case 'game:start':

        	break;

    	case 'player:reconnected':

        	playerWasReconnected = true;

        	break;

        case 'meme:create':

            $('#gameContent').html(eventData);

            $('#meme-slider').unslider({
                nav: false
            });

            break;

    }

};