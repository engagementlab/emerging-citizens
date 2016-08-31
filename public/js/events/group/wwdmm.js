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

var topBar = $('#top-header').detach();
topBar.prependTo('body');

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

  		updateGameContent(eventData);

  		break;

	  case 'meme:voting':

  		updateGameContent(eventData);
      
      $.each($('.meme-text'), function(index, text) {
          
          shrinkToFill(text, 30, 3);

      });

  		break;

	  case 'meme:results':

  		updateGameContent(eventData);

      function showScores() {

        $('#submissions').remove();
        
        var scoresAnim = new TimelineLite({onComplete: function() { showLeaderboard(); } });
        
        scoresAnim.from($('#scores'), 1, {autoAlpha:0}).add('scores')
        .to($('#scores'), 1, {autoAlpha:0, scale: 0, display: 'none', ease:Bounce.easeOut}, 'scores+=5');

      }

      function showLeaderboard() {

        $('#scores').remove();
        
        var leaderboardAnim = new TimelineLite({onComplete: function() { nextRound(); } });
        
        leaderboardAnim.from($('#leaderboard'), 1, {autoAlpha:0}).add('leaderboard')
        .to($('#leaderboard'), 1, {autoAlpha:0, scale: 0, display: 'none', ease:Bounce.easeOut}, 'leaderboard+=5');

      }

      function nextRound() {

        // Show countdown
        if($('#next-round')[0] !== undefined) {

          var secondsLeft = 10;
          var countdownAnim = new ProgressBar.Circle('#next-round #countdown', {
              color: '#fff',
              duration: secondsLeft*1000,
              easing: 'easeInOut',
              strokeWidth: 6,
              trailColor: '#f4f4f4',
              trailWidth: 0.8,
              fill: '#00c5c2',
              text: {
                  value: secondsLeft + '',
                  className: 'text',
              }
          });
          var countdownText = $('#next-round #countdown .text');

          var roundCountdown = setInterval(function() {
              secondsLeft--;

              TweenLite.to($(countdownText), .1, { scale: 0 });
              $(countdownText).text(secondsLeft);
              TweenLite.from($(countdownText), .1, { scale: 0 });

              // End countdown
              if(secondsLeft == 0) {
                  if($('#next-round')[0]) {
                      socket.emit('game:next_round', emitData(null));
                      clearInterval(roundCountdown);
                  }
                  else
                      location.href = '\\';
              }
          }, 1000);
            
        }

        TweenLite.from($('#next-round, #game-ended'), 1, { autoAlpha: 0, scale: 0 });

        countdownAnim.animate(1);

      }

      var submissionsAnim = new TimelineLite({paused: true, onComplete: function() { showScores(); }});

      submissionsAnim
      .from($('#submissions'), 1, {autoAlpha:0}).add('submissions')
      // .to($('#submissions'), 1, {autoAlpha:0, scale: 0, display: 'none', ease:Bounce.easeOut}, 'submissions+=10');

      var elements = $('#submissions .submission');

        // submissionsAnim.staggerFrom(elements, 1, {y:0, autoAlpha:0, ease:Elastic.easeOut}, 4);
        // submissionsAnim.staggerTo(elements, 1, {y:0, autoAlpha:0, ease:Elastic.easeOut}, 4);

      // 1) Show submissions
      _.each(elements, function(el, index) {

          submissionsAnim
          .from(el, 1, {y:0, scale: 0, autoAlpha:0, ease:Ease.easeOut}, '+=1.5')
          
          .from($(el).find('.meme'), 1, {y:100, scale: 0, autoAlpha:0, ease:Ease.easeOut}, '+=2')
          
          .from($(el).find('.votes-box'), .5, {y:100, scale: 0, autoAlpha:0, ease:Ease.easeOut}, '+=2.5')
          .staggerFrom($(el).find('.votes-box .vote'), .3, {scale: 0, autoAlpha:0, ease:Bounce.easeOut}, .3, '+=3')
          .staggerFrom($(el).find('.votes-box .vote .score'), 1, {scale: 0, autoAlpha:0, rotation:360, ease:Elastic.easeOut}, 1, '+=5')

          .from($(el).find('.name.submitter'), 1, {y:100, scale: 0, autoAlpha:0, ease:Ease.easeOut}, '+=6.5')

          .from($(el).find('.likes-box'), .5, {y:100, scale: 0, autoAlpha:0, ease:Ease.easeOut}, '+=7.5')
          .staggerFrom($(el).find('.likes-box .vote'), .3, {scale: 0, autoAlpha:0, ease:Bounce.easeOut}, .3, '+=8')
          .staggerFrom($(el).find('.likes-box .vote .score'), 1, {scale: 0, autoAlpha:0, rotation:-180, ease:Elastic.easeOut}, 1, '+=8.5')

          .to(el, 1, {y:0, scale: 0, autoAlpha:0, display:'none', ease:Ease.easeIn}, '+=10.5');

      });

      // Debugging
      if($('#slider-gsap').length) {
        resultsAnimSlider = new GSAPTLSlider(submissionsAnim, "slider-gsap", {
            width: 600
        });
      }
      
      submissionsAnim.play();

	    break;

	}

};