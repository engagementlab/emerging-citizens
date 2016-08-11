'use strict';
/**
 * Emerging Citizens
 * Developed by Engagement Lab, 2016
 * ==============
 * 
 * Script for GROUP'S WWDMM socket events. Loaded to group screen upon load of monitor view.
 * ==========
 */

var clockInterval;
var resultsAnimSlider;

var gameEvents = function(eventId, eventData) {
	
	/*
	  Catch socket events -- MAKE SURE ALL EVENT IDS ARE IN global.hbs
	*/
	switch (eventId) {
	  
	  case 'game:countdown':

	      if(clockInterval)
	          clearInterval(clockInterval);

          var secondsLeft = eventData.duration,
		      countdownText = $('.countdown #countdown');
         
          clockInterval = setInterval(function() {

			secondsLeft--;

			var displaySeconds = secondsToHms(secondsLeft);

			$(countdownText).html(displaySeconds);

			if(secondsLeft === 0)
				clearInterval(clockInterval);

          }, 1000);

	      break;

	  case 'meme:topic':
	  case 'meme:voting':
	  case 'meme:results':

	      $('#gameContent').html(eventData);

	      break;

	}

};