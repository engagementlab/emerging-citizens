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

		$('#gameContent').html(eventData);

		break;

	  case 'meme:voting':

		$('#gameContent').html(eventData);
        
        $.each($('.meme-text'), function(index, text) {
            
            shrinkToFill(text, 30, 3);

        });

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
        .from($('#submissions'), 1, {autoAlpha:0}).add('submissions')
        .to($('#submissions'), 1, {autoAlpha:0, scale: 0, display: 'none', ease:Bounce.easeOut}, 'submissions+=3')
        
        .from($('#scores'), 1, {autoAlpha:0}, 'submissions+=4').add('scores')
        .to($('#scores'), 1, {autoAlpha:0, scale: 0, display: 'none', ease:Bounce.easeOut}, 'scores+=3')
        
        .from($('#leaderboard-header'), 1, {autoAlpha:0}, 'scores+=3').add('leaderboard')
        .to($('#results-header'), 1, {autoAlpha:0}, 'scores+=3')
        
        .from($('#leaderboard'), 1, {autoAlpha:0}, 'scores+=3')
        
        .to($('#leaderboard'), 1, {autoAlpha:0, scale: 0, display: 'none', ease:Bounce.easeOut}, 'leaderboard+=3')
        
        .from($('#countdown'), 1, {autoAlpha:0, ease:Bounce.easeOut}, 'leaderboard+=4');
  
        if($('#slider-gsap').length) {
          resultsAnimSlider = new GSAPTLSlider(submissionsAnim, "slider-gsap", {
              width: 600
          });
        }
        
        submissionsAnim.play();

	    break;

	}

};