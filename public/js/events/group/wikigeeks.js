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
    Catch socket events -- MAKE SURE ALL EVENT IDS ARE IN global.hbs
  */
  switch (eventId) {

    case 'game:countdown':

      var countdownContainer = $('.countdown'),
          countdownText =  $('#countdown #text'),
          revealCountdownText = $('#article-reveal #countdown #text'),

          secondsLeft = eventData.duration,
          clockName = eventData.name;

      if(clockInterval)
        clearInterval(clockInterval);

      clockInterval = setInterval(function() {

          if(countdownPaused)
              return;

          secondsLeft--;
          console.log (secondsLeft, "seconds left");

          var displaySeconds = secondsToHms(secondsLeft);

          TweenLite.to(countdownText, .1, { scale: 0 });
          
          $(countdownText).html(displaySeconds);
          $(revealCountdownText).html(displaySeconds);
          
          TweenLite.from(countdownText, .1, { scale: 0 });

          // Show countdown if hidden
          if(countdownContainer.css('visibility') === 'hidden') {
            TweenLite.from(countdownContainer, .5, {autoAlpha:0, scale: 0.5, ease:Elastic.easeOut});

            // new TimelineLite()
            // .from(countdownContainer, .5, {autoAlpha:0, scale: 0.5, ease:Elastic.easeOut})
            // .from(countdownText.find('#m'), .5, {autoAlpha:0, scale: 0.5, delay: .5, ease:Elastic.easeOut})
            // .from(countdownText.find('#s'), .5, {autoAlpha:0, scale: 0.5, delay: 1, ease:Elastic.easeOut});
          }



          // End countdown
          if(secondsLeft == 0 && clockName === 'topicCountdown'){
            $('.row #countdown').hide();
            $('.timesUp').show();
              clearInterval(clockInterval);
            }
          
          // Article reveal warning modal
          else if(secondsLeft == 5 && clockName === 'topicCountdown') {

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
                
        $('#gameContent').html(eventData.html);
        $('#reveal').html(eventData.reveal);

        $('#overlay').fadeOut().empty();

        // Debugging
        $('#goto_results').hide();

        var staticPlayers = $('.player-static');
        var finishedPlayers = _.pluck(_.where(eventData.players, {finished:true}), 'username');
        console.log (finishedPlayers);

        _.each(finishedPlayers, function(name, index) {

            var nameFormatted = (name.length <= 15) ? name : name.substring(0, 15) + "...";

            $(staticPlayers[index]).children('.icon').addClass('active');
            $(staticPlayers[index]).children('.nameplate').addClass('active').text(nameFormatted);

        });

        break;

    case 'player:finished':

        var staticPlayers = $('.player-static');
        var finishedPlayers = _.pluck(_.where(eventData, {finished:true}), 'username');

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
        clearInterval(clockInterval);

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

          $('#results, #results-header').show();
         
            scoreAnim.fromTo($('#results-header'), 1, {autoAlpha:0, delay: 0}, {autoAlpha:1})
            .add('resultsShow')
            .from($('#results'), 1, {autoAlpha:0, scale: 0, ease:Bounce.easeOut, delay: 0}, 'resultsShow+=1')
            .staggerFromTo($('#results .user'), 1, { autoAlpha:0, scale:1, y:250}, {autoAlpha:1, scale: 1, y:0, ease:Bounce.easeOut}, 0.5, 'resultsShow+=3')
            .to($('#results'), 1, {autoAlpha:0, scale: 0, display: 'none', ease:Bounce.easeOut}, 'resultsShow+=9')
            .add('scoringShow')
            .add(function(){$('#scoring').show();})
            .from($('#scoring'), 1, {autoAlpha:0, scale: 0, ease:Bounce.easeOut}, 'scoringShow+=1')
            .staggerFromTo($('#scoring .user'), 1, { autoAlpha:0, scale:1, y:250}, {autoAlpha:1, scale: 1, y:0, ease:Bounce.easeOut}, 0.5, 'scoringShow+=3')
            .to($('#scoring'), 1, {autoAlpha:0, scale: 0, display: 'none', ease:Bounce.easeOut}, 'scoringShow+=7')
            .add('leadersShow')
            .add(function(){$('#leaderboard, #count').show();})
            .from($('#leaderboard'), 1, {autoAlpha:0, scale: 0, ease:Bounce.easeOut}, 'leadersShow+=1')
            .staggerFromTo($('#leaderboard .user'), 1, { autoAlpha:0, scale:1, y:250}, {autoAlpha:1, scale: 1, y:0, ease:Bounce.easeOut}, 0.5, 'leadersShow+=3')
            .from($('#countdown'), 1, {autoAlpha:0, ease:Bounce.easeOut}, 'leadersShow+=7');
            // .add(function(){
            //   socket.emit('game:countdown', { 10);
            // });
      
            if($('#slider-gsap').length) {
              wikiAnimSlider = new GSAPTLSlider(scoreAnim, "slider-gsap", {
                  width: 600
              });
            }
            
            scoreAnim.play();

        }

        var topPlayers = $('#top-players .player-path');
        _.each(topPlayers, function(player, index) {

            var articleTitles = $(player).find('.title');
            var articleDots = $(player).find('.articleDot');
            var articleLines = $(player).find('.articleLine');
            var last = articleTitles.size();
            var destination = $(last).find('.destination');

            // destination

            // Animate in each top player
            topPlayersAnim.from($(player), 2, {autoAlpha:0, scale: 0, ease:Bounce.easeOut, delay: 1});

            
            // Animate titles and path
            _.each(articleTitles, function(title, index) {

                topPlayersAnim.from($(title), .5, {autoAlpha:0, scale: 0, ease:Bounce.easeOut, delay: 1, onStart: function() {

                    var line = $(articleLines[index]);

                    // Animate lines and dots at start of title animation
                    $(articleDots[index]).velocity({r: 8}, 500, [50, 10]);
                    line.velocity({x2: line.data().x2, y2: line.data().y2}, 1000, [50, 10]);


            //         $('.destination').velocity({ 'stroke-dashoffset': 400 }, 0)
            // .velocity({ 'stroke-dashoffset': 0 }, { duration: 650, delay: 10 });
                    // if (index === last){
                      // _.each(destination, function(svg, index){
                      //       $(svg).velocity({ opacity:0 }, 0).velocity({opacity:1},{duration: 1000, delay: 10}, [50, 10]);
                      //   });
                     // }
                }});


            });

            // Hide this player
            topPlayersAnim.to($(player), 1, {autoAlpha:0, scale: 0, display: 'none', ease:Bounce.easeOut, delay: 5})

             
        });

      

        topPlayersAnim.play();

        break;


    case 'game:countdown_end':



        // $('input').disabled = true;

        // $('.timesUp').show();

        // setTimeout(function(){$('.timesUp').hide();}, 10000);

        break;

  }

};