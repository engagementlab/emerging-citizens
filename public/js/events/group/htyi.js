'use strict';
/**
 * Emerging Citizens
 * Developed by Engagement Lab, 2016
 * ==============
 * 
 * Script for GROUP'S HTYI socket events. Loaded to group screen upon load of monitor view.
 * ==========
 */

var hashtagsAnimSlider;
var gameEvents = function(eventId, eventData) {

  /*
    Catch socket events -- MAKE SURE ALL EVENT IDS ARE IN global.hbs
  */
  switch (eventId) {
    
    case 'hashtag:submitted':
    case 'hashtags:received':

      updateGameContent(eventData);
      
      // currentHashtags = _.pluck(eventData, 'hashtag-submissions');

      //instantiate a TimelineLite for hashtags received animation
      var hashtagsVoteAnim = new TimelineLite({ paused:true });
      $('#hashtag-submissions-prompt').show();

      hashtagsVoteAnim.from($('#hashtag-submissions-prompt'), 1, { y: -200, autoAlpha: 0, ease:Elastic.easeOut })
      .staggerFrom($('#hashtag-submissions .leftmost .hashtag'), 1, {xPercent:-100, autoAlpha:0, ease:Elastic.easeOut}, .5)
      .staggerFrom($('#hashtag-submissions .left .hashtag'), 1, {yPercent:100, autoAlpha:0, ease:Elastic.easeOut}, .5)
      .staggerFrom($('#hashtag-submissions .right .hashtag'), 1, {yPercent:100, autoAlpha:0, ease:Elastic.easeOut}, .5)
      .staggerFrom($('#hashtag-submissions .rightmost .hashtag'), 1, {xPercent:100, autoAlpha:0, ease:Elastic.easeOut, delay: .3}, .5);

      hashtagsVoteAnim.play();

      break;

    case 'hashtag:success':

      var staticPlayers = $('.player-static');
        var finishedPlayers = _.pluck(_.where(eventData, {submitted:true}), 'username');

        _.each(finishedPlayers, function(name, index) {

            var nameFormatted = (name.length <= 15) ? name : name.substring(0, 15) + "...";

            $(staticPlayers[index]).children('.icon').addClass('active');
            $(staticPlayers[index]).children('.nameplate').addClass('active').text(nameFormatted);

        });

      break;

    case 'hashtag:voted':

      var staticPlayers = $('.player-static');
        var finishedPlayers = _.pluck(_.where(eventData, {voted:true}), 'username');

        _.each(finishedPlayers, function(name, index) {

            var nameFormatted = (name.length <= 15) ? name : name.substring(0, 15) + "...";

            $(staticPlayers[index]).children('.icon').addClass('active');
            $(staticPlayers[index]).children('.nameplate').addClass('active').text(nameFormatted);

        });

      break;

    case 'hashtags:results':

      updateGameContent(eventData);

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

      // TweenLite.set(".cardWrapper", {perspective:400});
      // TweenLite.set(".back", {rotationX:180});
      // TweenLite.set([".back", ".front"], {backfaceVisibility:"hidden"});

      hashtagsAnim.play();

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
  console.log(winner);
  $(winner).addClass('winner');
  if($('#winners-circle')[0] !== undefined) {

      scoreAnim.from($('#winners-circle'), 1.5, {scale:0.5, autoAlpha:0, ease:Bounce.easeOut})
      .staggerTo($('.score-box').get().reverse, 1, {xPercent:-100, force3D:true, autoAlpha:0, ease:Elastic.easeOut, delay: 5}, .3)
      .staggerFrom($('.score-box').get().reverse(), 1.5, {xPercent:100, force3D:true, autoAlpha:0, ease:Elastic.easeOut}, 2)
      .to($('#winners-circle'), 1, {autoAlpha:0, display:'none', delay: 5})

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

  // Show countdown
  // TEMP: Only for next round for now, not final one
  if($('#next-round')[0] !== undefined) {

      var secondsLeft = 10;
      var countdownAnim = new ProgressBar.Circle('.last #countdown', {
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
      var countdownText =  $('.last #countdown .text');

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
