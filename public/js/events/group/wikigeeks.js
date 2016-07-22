'use strict';
/**
 * Emerging Citizens
 * Developed by Engagement Lab, 2016
 * ==============
 * 
 * Script for GROUP'S WikiGeeks socket events. Loaded to group screen upon load of monitor view.
 * ==========
 */

var clockInterval;
var wikiAnimSlider;


var gameEvents = function(eventId, eventData) {

  /*
    Catch socket events
  */
  switch (eventId) {

    case 'game:countdown':

      var countdownContainer = $('.countdown'),
          countdownText =  $('#countdown #text'),
          revealCountdownText = $('#article-reveal #countdown #text'),

          secondsLeft = eventData.duration,
          clockName = eventData.name;

      clockInterval = setInterval(function() {

          if(countdownPaused)
              return;

          secondsLeft--;
          console.log (secondsLeft, "seconds left");

          let displaySeconds = (secondsLeft < 10) ? '0'+secondsLeft : secondsLeft;

          TweenLite.to(countdownText, .1, { scale: 0 });
          
          $(countdownText).text('0:' + displaySeconds);
          $(revealCountdownText).text('0:' + displaySeconds);
          
          TweenLite.from(countdownText, .1, { scale: 0 });

          if(countdownContainer.css('visibility') === 'hidden')
            TweenLite.from(countdownContainer, .5, {autoAlpha:0, scale: 0.5, ease:Elastic.easeOut});

          // End countdown
          if(secondsLeft == 0 && (clockName === 'articleReveal' || clockName === 'topicCountdown')) {
              clearInterval(clockInterval);
          }
          else if(secondsLeft == 5 && (clockName === 'articleReveal' || clockName === 'topicCountdown')) {

              var revealContainer = $('#article-reveal')

              countdownContainer.fadeOut(300);
              revealContainer.fadeIn(500, function() {
                  TweenLite.from($(revealContainer).find('#content'), .5, {autoAlpha:0, scale: 0.5, ease:Elastic.easeOut});
              });
              var countdownAnim = new ProgressBar.Circle(
                  '#article-reveal #countdown', 
                  {
                      color: '#fff',
                      duration: secondsLeft*1000,
                      easing: 'easeInOut',
                      strokeWidth: 6,
                      trailColor: '#f4f4f4',
                      trailWidth: 0.8,
                      fill: '#00c5c2',
                      from: { color: '#00c5c2', width: 1 },
                      to: { color: '#fff', width: 4 },
                      // Set default step function for all animate calls
                      step: function(state, circle) {
                          circle.path.setAttribute('stroke', state.color);
                          circle.path.setAttribute('stroke-width', state.width);
                          circle.setText(secondsLeft);
                      }
                  }
              );
              countdownAnim.animate(1);

          } 

      }, 1000);

      break;

    case 'topic:info':
                
        $('#gameContent').html(eventData);
        $('#reveal').html(eventData.reveal);

        $('#overlay').fadeOut().empty();

        // Debugging
        $('#goto_results').hide();

        break;

    case 'player:finished':

        console.log ("a player finished");

        var staticPlayers = $('.player-static');
        var finishedPlayers = _.pluck(_.where(eventData, {finished:true}), 'username');
        console.log (finishedPlayers);

        _.each(finishedPlayers, function(name, index) {

            var nameFormatted = (name.length <= 15) ? name : name.substring(0, 15) + "...";

            $(staticPlayers[index]).children('.icon').addClass('active');
            $(staticPlayers[index]).children('.nameplate').addClass('active').text(nameFormatted);

        });

      break;

    // Time expired, waiting for one player to reach target
    case 'wiki:waiting':

      $('.countdown #countdown').fadeOut(500, function() {
          $('.countdown #out-of-time').fadeIn(500);
      });

      // Debugging
      $('#goto_results').show();

      break;

    case 'wiki:results':
        
        $('#gameContent').html(eventData);

        function roundCountdown() {

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

        var topPlayersAnim = new TimelineLite({paused: true, onComplete: function() { scoreAnimPlay(); } });
        var scoreAnim = new TimelineLite({paused: true, onComplete: function() { roundCountdown(); } });
        
        function scoreAnimPlay() {
         
            scoreAnim.from($('#results-header'), 1, {autoAlpha:0, delay: 2})

            .from($('#results'), 1, {autoAlpha:0, scale: 0, ease:Bounce.easeOut0, delay: 2}).add('resultsShow')
            .to($('#results'), 1, {autoAlpha:0, scale: 0, display: 'none', ease:Bounce.easeOut}, 'resultsShow+=5')
            
            .from($('#scoring'), 1, {autoAlpha:0, scale: 0, ease:Bounce.easeOut}, 'resultsShow+=6')
            .to($('#scoring'), 1, {autoAlpha:0, scale: 0, display: 'none', ease:Bounce.easeOut}, 'resultsShow+=11')
            
            .from($('#leaderboard'), 1, {autoAlpha:0, scale: 0, ease:Bounce.easeOut}, 'resultsShow+=12')
            .from($('#countdown'), 1, {autoAlpha:0, ease:Bounce.easeOut}, 'resultsShow+=13');

             wikiAnimSlider = new GSAPTLSlider(scoreAnim, "slider-gsap", {
                width: 600
            });

            scoreAnim.play();

        }

        var topPlayers = $('#top-players .player-path');
        _.each(topPlayers, function(player, index) {

            var articleTitles = $(player).find('.title');
            var articleDots = $(player).find('.articleDot');
            var articleLines = $(player).find('.articleLine');

            // Animate in each top player
            topPlayersAnim.from($(player), 1, {autoAlpha:0, scale: 0, ease:Bounce.easeOut, delay: 1});

            // Animate titles and path
            _.each(articleTitles, function(title, index) {

                topPlayersAnim.from($(title), .5, {autoAlpha:0, scale: 0, ease:Bounce.easeOut, delay: .5, onStart: function() {

                    var line = $(articleLines[index]);

                    // Animate lines and dots at start of title animation
                    $(articleDots[index]).velocity({r: 8}, 500, [50, 10]);
                    line.velocity({x2: line.data().x2, y2: line.data().y2}, 1000, [50, 10])
                 
                }});
            });

            // Hide this player
            topPlayersAnim.to($(player), 1, {autoAlpha:0, scale: 0, display: 'none', ease:Bounce.easeOut, delay: (articleTitles.length/2)*(index+1)})

        });

      //   wikiAnimSlider = new GSAPTLSlider(topPlayersAnim, "slider-gsap", {
      //     width: 600
      // });

        topPlayersAnim.play();

        break;

  }

};
