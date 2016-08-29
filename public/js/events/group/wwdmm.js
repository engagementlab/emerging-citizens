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

      function showScores() {

        $('#submissions').remove();
        
        var scoresAnim = new TimelineLite({onComplete: function() { showLeaderboard(); } });
        
        scoresAnim.from($('#scores'), 1, {autoAlpha:0}).add('scores')
        .to($('#scores'), 1, {autoAlpha:0, scale: 0, display: 'none', ease:Bounce.easeOut}, 'scores+=5');

      }

      function showLeaderboard() {

        $('#scores').remove();
        
        var leaderboardAnim = new TimelineLite({onComplete: function() { roundCountdown(); } });
        
        leaderboardAnim.from($('#leaderboard'), 1, {autoAlpha:0}).add('leaderboard')
        .to($('#leaderboard'), 1, {autoAlpha:0, scale: 0, display: 'none', ease:Bounce.easeOut}, 'leaderboard+=5');

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

          // creators = $(el).find('.creator');
          // creatorWrapper = $(el).find('.creatorWrapper');
          // num = creators.size();

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
          // submissionsAnim.from($(el).find('.likes-box'), 1, {y:100, scale: 0, autoAlpha:0, ease:Ease.easeOut}, '+=3')

/*          .staggerFrom($(el).find('.voter'), 2, {scale:0, opacity:1, ease:Elastic.easeOut, onStart: function() {

              ion.sound.play("button_tiny");

          }}, 2, '+=0.5')
          .fromTo(creatorWrapper, 1, {scale:0, opacity:0, autoAlpha:0, delay: 1}, {scale: 1, opacity: 1, autoAlpha:1}, 1, '+=2.5');

          if (num > 1) {
              hashtagsAnim
              .add(function(){
                $(creatorWrapper).cycle();
                $(creatorWrapper).cycle('goto', 0);
                $(creatorWrapper).cycle("pause");                
              }, 1, "+=0.5")
              .add(function(){
                $(creatorWrapper).cycle("resume");
              }, "-=0.5");
             

          } else {

          }
          hashtagsAnim
          .staggerTo($(el).find('.voter .nameplate'), 0.2, { scale: 0, autoAlpha:0, display: 'none'}, 0.2, '+=0.5')
              .add(function(){

                // $(el).find('.voterWrapper').attr("data-cycle-delay", 500);
                $(el).find('.voterWrapper').cycle();
                $(el).find('.voterWrapper').cycle('goto', 0);
                // $(el).find('.voterWrapper').cycle("pause");
                // $(el).find('.voterWrapper').cycle("next");
                // $(el).find('.voterWrapper').cycle("destroy");
                
                console.log("cycling");
              }, "+=1.0")
              .to(el, 1, {delay: 3, y:250, autoAlpha:0, display:'none'});*/

      });
        
        // .from($('#leaderboard-header'), 1, {autoAlpha:0}, 'scores+=3').add('leaderboard')
        // .to($('#results-header'), 1, {autoAlpha:0}, 'scores+=3')
        
        // .from($('#leaderboard'), 1, {autoAlpha:0}, 'scores+=3')
        
        // .to($('#leaderboard'), 1, {autoAlpha:0, scale: 0, display: 'none', ease:Bounce.easeOut}, 'leaderboard+=3')
        
        // .from($('#countdown'), 1, {autoAlpha:0, ease:Bounce.easeOut}, 'leaderboard+=4');
  
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