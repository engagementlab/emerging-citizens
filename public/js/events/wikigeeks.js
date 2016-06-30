/**
 * Emerging Citizens
 * Developed by Engagement Lab, 2016
 * ==============
 * 
 * Script for PLAYERS' WikiGeeks socket events. Loaded to client upon successful login.
 * ==========
 */

var gameEvents = function(eventId, eventData) {

		console.log('binding event for ID: ' + eventId)

    switch (eventId) {
    
         // Begin article search
        case 'article:found':

            $('#gameContent').html(eventData);

            break;

    }

};