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

var header = $('#top-header');
var topBar = header.detach();
topBar.after('#nav-close-wrapper');

var lobbyAnim = new TimelineLite();
lobbyAnim
.fromTo(header, 1, {y:'-100%'}, {y:'-10%', autoAlpha:1, ease:Elastic.easeOut, delay: 0.5}).add('header')
.from($('.room-container'), 1, {y:'-200%', autoAlpha:0, ease:Elastic.easeOut}, 'header+=.5')
.from($('.players-left'), 1.25, {x: 600, autoAlpha:0, ease:Elastic.easeOut}, 'header+=1')
.from($('.players-right'), 1.25, {x: -600, autoAlpha:0, ease:Elastic.easeOut}, 'header+=1');

/* 
 Renders each meme on screen to canvases
*/
var loadMemes = function() {
  
  $.each($('.meme-canvas'), function(index, meme) {

      var upperText = $(meme).data().upper ? $(meme).data().upper.toString() : '',
          lowerText = $(meme).data().lower ? $(meme).data().lower.toString() : '',
          sizing = $(meme).data().dimension;

      // Create meme canvas, render layer, captions, and image
      var canvas = new Kinetic.Stage({
          container: $(meme)[0],
          width: sizing,
          height: sizing
      }),
      layer = new Kinetic.Layer(),
      upperCaption = new Kinetic.Text({
          name: 'upper',
          x: 0,
          y: 20,
          text: upperText.toUpperCase(),
          fontSize: 46,
          fontFamily: 'Impact, "Impact-External"',
          fill: '#fff',
          stroke: '#000',
          strokeWidth: 2,
          lineJoin: 'round',
          width: sizing,
          align: 'center'
      }),
      lowerCaption = new Kinetic.Text({
          name: 'lower',
          x: 0,
          y: 150,
          text: lowerText.toUpperCase(),
          fontSize: 46,
          fontFamily: 'Impact, "Impact-External"',
          fill: '#fff',
          stroke: '#000',
          strokeWidth: 2,
          lineJoin: 'round',
          width: sizing,
          align: 'center'
      });
  
      // Add all elements to render layer on image load
      var memeImg = new Image();
      memeImg.onload = function() {

        var imgInstance = new Kinetic.Image({
            x: 0,
            y: 0,
            width: canvas.getWidth(),
            height: canvas.getHeight(),
            image: memeImg
        });
        
        layer.add(imgInstance);
        layer.add(upperCaption);
        layer.add(lowerCaption);

        // Set caption font sizing and lower caption position
        upperCaption.fontSize(getFontSize(upperText) * 0.8);
        lowerCaption.fontSize(getFontSize(lowerText) * 0.8);

        lowerCaption.setY(canvas.getHeight() - lowerCaption.getHeight() - 20);

        // Add layer to canvas
        canvas.add(layer);

        // Draw layer
        layer.draw();

      }
      // Set image source so it loads
      memeImg.src = $(meme).data().img;

  });

}

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

          if(countdownText.length === 0)
            countdownText = $('.countdown #countdown');
          
    			secondsLeft--;

    			var displaySeconds = secondsToHms(secondsLeft);

    			$(countdownText).html(displaySeconds);

    			if(secondsLeft === 0)
    				clearInterval(clockInterval);

        }, 1000);

      break;

	  case 'meme:topic':

  		updateGameContent(eventData, function() {
        
        var topicAnim = new TimelineLite();
        topicAnim
        .fromTo($('#top-header'), 1, {y:'-100%'}, {y:'-10%', autoAlpha:1, ease:Elastic.easeOut}).add('header')
        .from($('.room-container'), 1, {y:'-200%', autoAlpha:0, ease:Elastic.easeOut}, 'header+=.5')
        .from($('.players-left'), 1.25, {x: 600, autoAlpha:0, ease:Elastic.easeOut}, 'header+=1')
        .from($('.players-right'), 1.25, {x: -600, autoAlpha:0, ease:Elastic.easeOut}, 'header+=1');

        $('.nameplate').css('opacity', '0.4');
      
      });

  		break;

    case 'meme:received':

      var submitter = $('.player-static[data-id="' + eventData.id + '"]');

      // Set player who submitted to 'active' state in player grid
      $(submitter).addClass('active');
      $(submitter).find('.icon').addClass('active');
      $(submitter).find('.nameplate').css('opacity', '1').addClass('active');

      // var staticPlayers = $('.player-static');
      // var submitter = staticPlayers[eventData.index];

      // // Set player who submitted to 'active' state in player grid
      // $(submitter).addClass('active');
      // $(submitter).find('.nameplate').css('opacity', '1').addClass('active');
      // $(submitter).find('.icon').addClass('active');

      break;

	  case 'meme:voting':

  		updateGameContent(eventData, function() {
        loadMemes();
        
        var topicAnim = new TimelineLite();
        topicAnim
        .fromTo($('#top-header'), 1, {y:'-100%'}, {y:'-10%', autoAlpha:1, ease:Elastic.easeOut}).add('header')
        .from($('#top-header #topic'), 1, {autoAlpha:0}).add('header+=.3')
        .from($('#top-header #descriptor'), 1, {autoAlpha:0}).add('header+=.6')
        .staggerFrom($('.meme-canvas'), .75, {scale:0, autoAlpha:0, ease:Elastic.easeOut}, .3, 'header+=1.5');
      });

  		break;

	  case 'meme:results':

      updateGameContent(eventData, function() {
        
        loadMemes();

        function showScores() {

          $('#submissions').fadeOut(500).remove();
          
          var scoresAnim = new TimelineLite({onComplete: function() { showLeaderboard(); } });
          
          scoresAnim.from($('#scores'), 1, {autoAlpha:0}).add('scores')
          .to($('#scores'), 1, {autoAlpha:0, scale: 0, display: 'none', ease:Bounce.easeOut}, 'scores+=4');

        }

        function showLeaderboard() {
          
          var leaderboardAnim = new TimelineLite({onComplete: function() { nextRound(); } });
          
          leaderboardAnim
          .to($('#round-header'), .5, {autoAlpha:0, y:'0%', display:'none'}).add('header')
          .fromTo($('#leaderboard-header'), .5, {autoAlpha:0, y:'50%'}, {autoAlpha:1, y:'0%', display:'block'}, 'header+=.6')

          .from($('#leaderboard'), 1, {autoAlpha:0}).add('leaderboard')
          
          .to($('#leaderboard'), 1, {autoAlpha:0, scale:0, display:'none', ease:Bounce.easeOut}, 'leaderboard+=4');

        }

        function nextRound() {

          var nextRoundAnim = new TimelineLite();

          // Show countdown
          if($('#next-round')[0]) {
            
            nextRoundAnim
            .to($('#leaderboard-header'), .5, {autoAlpha:0, y:'50%', display:'none'}).add('header')
            .fromTo($('#next-round-header'), .5, {autoAlpha:0, y:'50%'}, {autoAlpha:1, y:'0%', display:'block'}, 'header+=.6')
              
            TweenLite.from($('#next-round, #game-ended'), 1, { autoAlpha: 0, scale: 0 });

          }
          // Winners circle
          else {

            nextRoundAnim
            .to($('#leaderboard-header'), .5, {autoAlpha:0, y:'0%', display:'none'}).add('header')
            .fromTo($('#winners-header'), .5, {autoAlpha:0, y:'50%'}, {autoAlpha:1, y:'0%', display:'block'}, 'header+=.6')
            
            .from($('#winners-circle'), 1, {autoAlpha:0})
            .to($('#winners-circle'), 1, {autoAlpha:0, display:'none'}, 'header+=6')

            .to($('#winners-header'), .5, {autoAlpha:0, y:'50%', display:'none'}).add('header+=6')
            .fromTo($('#ended-header'), .5, {autoAlpha:0, y:'50%'}, {autoAlpha:1, y:'0%', display:'block'}, 'header+=7')
            .from($('#next-round, #game-ended'), 1, {autoAlpha:0, scale:0}, 'header+=7.1');

            socket.emit('game:show_survey', emitData());

          }

        }

        var submissionsAnim = new TimelineLite({onComplete: function() { showScores(); }});

        submissionsAnim
        .from($('#submissions'), 1, {autoAlpha:0}).add('submissions');
        
        var elements = $('#submissions .submission');

        // 1) Show submissions
        _.each(elements, function(el, index) {

            submissionsAnim
            .from(el, 1, {y:0, scale: 0, autoAlpha:0, ease:Ease.easeOut}, '+=.5')
            
            .from($(el).find('.meme'), 1, {y:100, scale: 0, autoAlpha:0, ease:Ease.easeOut}, '+=.5')
            
            .from($(el).find('.votes-box'), .5, {y:100, scale: 0, autoAlpha:0, ease:Ease.easeOut}, '+=.5')
            .staggerFrom($(el).find('.votes-box .vote'), .3, {scale: 0, autoAlpha:0, ease:Bounce.easeOut}, .3, '+=.4')
            .staggerFrom($(el).find('.votes-box .vote .score'), 1, {scale: 0, autoAlpha:0, rotation:360, ease:Elastic.easeOut}, 1, '+=.4')

            .from($(el).find('.name.submitter'), 1, {y:100, scale: 0, autoAlpha:0, ease:Ease.easeOut}, '+=2')

            .to(el, 1, {y:0, scale: 0, autoAlpha:0, display:'none', ease:Ease.easeIn}, '+=4');

        });

        // Debugging
        if($('#slider-gsap').length) {
          resultsAnimSlider = new GSAPTLSlider(submissionsAnim, "slider-gsap", {
              width: 600
          });
        }
        
      });

	    break;

	}

};