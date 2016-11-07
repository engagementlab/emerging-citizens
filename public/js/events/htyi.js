/**
 * Emerging Citizens
 * Developed by Engagement Lab, 2016
 * ==============
 * 
 * Script for PLAYERS' HTYI socket events. Loaded to client upon successful login.
 * ==========
 */

// Add game type class to body
$('.body').addClass('htyi');

// Get if player is in reconnected state
var playerWasReconnected = (sessionStorage.getItem('reconnected') === 'true');

/* 
 Disallows input from octothorp (#) character for hashtag submission
*/
$(document).on('keypress', '#tweet_input', function(key) {
    
    if(key.charCode === 35)
        return false;

});

var gameEvents = function(eventId, eventData) {

    /*
        Catch socket events -- MAKE SURE ALL EVENT IDS ARE IN global.hbs
    */
    switch (eventId) {

        case 'game:start':

            sessionStorage.setItem('voted', false);

            if(sessionStorage.playerSubmission && playerWasReconnected === true) {
                gameEvents('hashtag:success', sessionStorage.playerSubmission);
                playerWasReconnected = false;
                return;
            }
            
            $("#tweet_input").keydown(function(event) {
                if(event.keyCode == 13)
                    $('#btn_submit').click();
            });

          break;
        case 'hashtag:tryagain':

            $('#tweet_input').val('').addClass('invalid');
            $('#tweet-submission .error').text(eventData).fadeIn();
            
            $('#btn_submit').removeAttr('disabled');
            
            loadToggle(false, true);

            break;

        // Hashtag successfully submitted
        case 'hashtag:success':

            $('#countdownTimer').empty();

            new TimelineLite()
            .to($('#tweet-submission'), .5, {scale:0, autoAlpha:0, display:'none'})
            .from($('#submitted'), .5, {scale:0, autoAlpha:0});

            sessionStorage.setItem('playerSubmission', eventData);

            loadToggle(false);

            break;
    
        case 'hashtags:received':

            updateGameContent(eventData, function(animateIn) {

                // Remove current player's submission from selections
                var myHash = $('button.voting-button[data-package="' + sessionStorage.getItem('playerSubmission') + '"]');

                myHash.remove();
                animateIn();
                
                // Hide voting (if player was reconnected and already voted)?
                if(playerWasReconnected && (sessionStorage.getItem('voted') === 'true'))
                {
                    $('#' + $('#submitted').data('hide')).remove();
                    $('#submitted').show();
                }

            }, true);

            break;


        case 'hashtag:results':

            resetSession();

            break;

        case 'game:countdown_ending':

            if (sessionStorage.playerSubmission && playerWasReconnected === true)
                playerWasReconnected = false;

            if (!sessionStorage.playerSubmission){
                $('.form .error').html("15 seconds left, time is almost up!<br />If you can't come up with a hashtag, we will choose one for you...");
                bounce();
            }

            break;


    }

};