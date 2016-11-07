'use strict';
/**
 * Emerging Citizens
 * Developed by Engagement Lab, 2016
 * ==============
 * 
 * Script for GROUP'S HTYI socket events. Loaded to group screen upon load of monitor view.
 * ==========
 */

var clockInterval;
var hashtagsAnimSlider;

// Show players
new TimelineLite()
.from($('.room-container'), 1, {scale:0, autoAlpha:0, delay:1, ease:Elastic.easeOut})
.staggerFrom($('.players.left .player-background'), 2, {xPercent:-200, force3D:true, autoAlpha:0, ease:Elastic.easeOut}, .1)
.staggerFrom($('.players.right .player-background'), 2, {xPercent:200, force3D:true, autoAlpha:0, ease:Elastic.easeOut}, .1)

var gameEvents = function(eventId, eventData) {

  /*
    Catch socket events -- MAKE SURE ALL EVENT IDS ARE IN global.hbs
  */
  switch (eventId) {

    case 'game:start':

      // Called after updateGameContent succeeds
      updateContentCallback = function() {
        // Make icons inactive
        $('.player-background .icon').removeClass('active');

        // Show players
        new TimelineLite()
        .staggerFrom(_.shuffle($('.player-background')), 2, {scale:0, autoAlpha:0, ease:Elastic.easeOut}, .1);

        // Clear prior content callback
        updateContentCallback = undefined;
      }
      
      break;

    case 'game:countdown':

      var secondsLeft = eventData.duration;
      var timeFactor = 360 / secondsLeft;
      var clockHand = $('#clock-hand');

      if(clockInterval)
        clearInterval(clockInterval);
          
      clockInterval = setInterval(function() {

          // if(clockHand.length === 0)
          clockHand = $('#clock-hand');

          function clockTick() {
              clockHand.css({
                  transform:'rotateZ('+ -(timeFactor*secondsLeft) + 'deg)'
              });
              secondsLeft--;
          }

          clockTick();

          if(secondsLeft === 0)
              clearInterval(clockInterval);
      }, 1000);

      break;

    case 'hashtag:success':

      var submitter = $('.player-static[data-id="' + eventData.id + '"]');

      // Set player who submitted to 'active' state in player grid
      $(submitter).addClass('active');
      $(submitter).find('.icon').addClass('active');

      break;

    case 'hashtags:received':

      updateGameContent(eventData, function() {
        // Make icons inactive
        $('.player-background .icon').removeClass('active');

        // Show players
        new TimelineLite()
        .staggerFrom(_.shuffle($('.player-background')), 2, {scale:0, autoAlpha:0, ease:Elastic.easeOut}, .1);
     
        //instantiate a TimelineLite for hashtags received animation
        var hashtagsVoteAnim = new TimelineLite({ paused:true });
        $('#hashtag-submissions-prompt').show();

        hashtagsVoteAnim.from($('#hashtag-submissions-prompt'), 1, { y: -200, autoAlpha: 0, ease:Elastic.easeOut })
        .staggerFrom($('#hashtag-submissions .leftmost .hashtag'), 1, {xPercent:-100, autoAlpha:0, ease:Elastic.easeOut}, .5)
        .staggerFrom($('#hashtag-submissions .left .hashtag'), 1, {yPercent:100, autoAlpha:0, ease:Elastic.easeOut}, .5)
        .staggerFrom($('#hashtag-submissions .right .hashtag'), 1, {yPercent:100, autoAlpha:0, ease:Elastic.easeOut}, .5)
        .staggerFrom($('#hashtag-submissions .rightmost .hashtag'), 1, {xPercent:100, autoAlpha:0, ease:Elastic.easeOut, delay: .3}, .5);

        hashtagsVoteAnim.play();
     
      });

      break;

    /*case 'hashtag:voted':

      var finishedPlayerIds = eventData;

      _.each(finishedPlayerIds, function(id, index) {

        debugger;

          var staticPlayer = $('.player-static[data-id="' + id + '"]');
          $(staticPlayer).find('.icon').addClass('active');

      });

      break;*/

    case 'hashtags:results':

      updateGameContent(eventData, function() {

        //instantiate a TimelineLite for hashtags animation
        var hashtagsAnim = new TimelineLite({ paused:true , onComplete:function() { showScores(); }});

        var elements = $('#hashtag-results .result.fake');
        var realHashtag = $('#hashtag-results .result.real');
        var creators;
        var creatorWrapper;
        var num;

        // 1) Show hashtags
        hashtagsAnim.from($('#hashtags'), 1.5, {top:-250, autoAlpha:0, ease:Bounce.easeOut});
        _.each(elements, function(el, index) {

            creators = $(el).find('.creator');
            creatorWrapper = $(el).find('.creatorWrapper');

            num = creators.size();

            hashtagsAnim.from(el, 1, {y:0, autoAlpha:0, ease:Bounce.easeOut})
            .staggerFrom($(el).find('.voter'), 2, {scale:0, opacity:1, ease:Elastic.easeOut, onStart: function() {

                ion.sound.play("button_tiny");

            }}, 2, '+=0.5')
            .fromTo(creatorWrapper, 1, {scale:0, opacity:0, autoAlpha:0, delay: 1, display: 'none'}, {scale: 1, opacity: 1, autoAlpha:1, display:'block'}, '+=0.5')
            .addLabel('creator');
            if (num > 1) {

                hashtagsAnim
                .add(function(){
                  $(el).find('.creatorWrapper').cycle({
                    'loop': 1, 
                    'slides': '.creator', 
                    'delay': 200, 
                    'paused': true, 
                    'starting-slide': 0
                    });
                  $(el).find('.creatorWrapper').cycle('goto', 0);
                  // $(creatorWrapper).cycle('reinit');
                  console.log("cycling first");
                  $(el).find('.creatorWrapper').cycle("pause");  
                  $(el).find('.creatorWrapper').cycle("resume");              
                },"creator");
               

            } 

            hashtagsAnim
            .staggerTo($(el).find('.voter .nameplate'), 0.2, { scale: 0, autoAlpha:0, display: 'none'}, 0.2, '+=0.5')
            .add(function(){

              $(el).find('.voterWrapper').cycle();
              $(el).find('.voterWrapper').cycle('goto', 0);
              
              console.log("cycling");
            }, "+=1.0")
            .to(el, 1, {delay: 3, y:250, autoAlpha:0, display:'none'});

        });

        // 2) Real hashtag
        hashtagsAnim
        .fromTo($(realHashtag), 1, {delay: 0.5, y:-250, autoAlpha:0, ease:Bounce.easeOut}, { y:0, autoAlpha:1}, 'real')
        .fromTo($('#hashtag-results #prompt'), 0.5, {delay: 0, y:0, autoAlpha:1, opacity: 1, ease:Elastic.easeOut}, {y: 0, autoAlpha: 1, opacity: 1}, 2,  'real +=0.5')
        .from($(realHashtag).find('.hashtag'), 1, { delay: 0.5, y: 100, autoAlpha: 0}, 'real +=1.0')
        .staggerFrom($(realHashtag).find('.voter'), 3, {delay: 0, scale:0, opacity:1, ease:Elastic.easeOut, onStart: function() {

            ion.sound.play("button_tiny");

        }}, 2)
        .staggerTo($(realHashtag).find('.voter .portrait'), 1, { scale: 0, autoAlpha:0, display: 'none', ease:Elastic.easeOut }, 1, '=0')
        .staggerFromTo($(realHashtag).find('.voter .points'), 0.5, { scale: 0, opacity:0, display: 'block' }, { scale: 1, opacity: 1, display: 'block'}, 0.5, '-=0.5')
        .to($('#hashtags'), 1, {delay: 2, y:-200, autoAlpha: 0, display:'none', ease:Elastic.easeIn});

        if($('#slider-gsap').length) {
          hashtagsAnimSlider = new GSAPTLSlider(hashtagsAnim, "slider-gsap", {
              width: 600
          });
        }
        hashtagsAnim.play();

      });

      break;

  }

};

function showScores() {

  var scoreAnim = new TimelineLite({paused: true, onComplete:function() { nextRound(); }});

  $('#hashtags').remove();

  if(hashtagsAnimSlider !== undefined && hashtagsAnimSlider !== null)
      hashtagsAnimSlider.clear();

  // Current Scores
  scoreAnim.from($('#scores'), 1.5, {autoAlpha:0, ease:Bounce.easeOut})
  .staggerFrom($('#scores .left .player'), 1, {xPercent:-100, force3D:true, autoAlpha:0, ease:Elastic.easeOut}, 1)
  .staggerFrom($('#scores .right .player'), 1, {xPercent:100, force3D:true, autoAlpha:0, ease:Elastic.easeOut, delay: .3}, 1, "players")
  .to($('#scores'), 1, {autoAlpha:0, display:'none', delay: 3});

  // Winner Circle, if rendered
  var winner = $('.score-box')[0];
  $(winner).addClass('winner');

  if($('#winners-circle')[0] !== undefined) {

      scoreAnim.from($('#winners-circle'), 1.5, {scale:0.5, autoAlpha:0, ease:Bounce.easeOut})
      .staggerTo($('.score-box').get().reverse, 1, {xPercent:-100, force3D:true, autoAlpha:0, ease:Elastic.easeOut, delay: 5}, .3)
      .staggerFrom($('.score-box').get().reverse(), 1.5, {xPercent:100, force3D:true, autoAlpha:0, ease:Elastic.easeOut}, 2)
      .to($('#winners-circle'), 1, {autoAlpha:0, display:'none', delay: 5})

      socket.emit('game:show_survey', emitData());
  }

  // Leaderboard
  scoreAnim.to($('#leaderboard'), 1.5, {autoAlpha:1, display: 'block', ease:Bounce.easeOut})
  .staggerFrom($('#leaderboard .left .player'), 1, {xPercent:-100, force3D:true, autoAlpha:0, ease:Elastic.easeOut}, .5)
  .staggerFrom($('#leaderboard .right .player'), 1, {xPercent:100, force3D:true, autoAlpha:0, ease:Elastic.easeOut, delay: .3}, .5)
  .to($('#leaderboard'), 1, {autoAlpha: 0, yPercent: 100, display:'none', delay: 5})

  if($('#slider-gsap').length) {
    hashtagsAnimSlider = new GSAPTLSlider(scoreAnim, "slider-gsap", {
        width: 600
    });
  }
  
  scoreAnim.play();

}

function nextRound() {

  $('#scores, #winners-circle, #leaderboard').remove();

  TweenLite.from($('#next-round, #game-ended'), 1, { autoAlpha: 0, scale: 0 });
  
}
