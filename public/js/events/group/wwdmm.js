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

		$('#gameContent').html(eventData);

		break;

	  case 'meme:results':

		$('#gameContent').html(eventData);

        function roundCountdown() {

        	debugger;

            if(countdownPaused)
                return;
            
            var countdownText = $('#countdown #text');
            var secondsLeft = 10;
            var roundInterval = setInterval(function() {
                
                secondsLeft--;
                $(countdownText).text(secondsLeft);

                if(secondsLeft == 0)
                {
                    clearInterval(roundInterval);
                    
                    // Return home if winners circle showing
                    if($('#winners-circle')[0])
                        location.href = '\\';
                    else 
                        socket.emit('game:next_round', emitData(null));
                }
        
            }, 1000);

        }

        var submissionsAnim = new TimelineLite({paused: true, onComplete: function() { roundCountdown(); } });

        submissionsAnim
        .from($('#submissions'), 1, {autoAlpha:0})
        .to($('#submissions'), 1, {autoAlpha:0, scale: 0, display: 'none', delay: 3, ease:Bounce.easeOut})
        .from($('#scores'), 1, {autoAlpha:0})
        .to($('#scores'), 1, {autoAlpha:0, scale: 0, display: 'none', delay: 6, ease:Bounce.easeOut})
        .from($('#leaderboard'), 1, {autoAlpha:0})
        .to($('#leaderboard'), 1, {autoAlpha:0, scale: 0, display: 'none', delay: 9, ease:Bounce.easeOut})
        .from($('#countdown'), 1, {autoAlpha:0, ease:Bounce.easeOut});
  
        if($('#slider-gsap').length) {
          resultsAnimSlider = new GSAPTLSlider(submissionsAnim, "slider-gsap", {
              width: 600
          });
        }
        
        submissionsAnim.play();

	    break;

	}

};