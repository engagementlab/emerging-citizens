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

            if(sessionStorage.playerSubmission && playerWasReconnected) {
                gameEvents('hashtag:success', sessionStorage.playerSubmission);
                return;
            }

            $("#tweet_input").keydown(function(event) {
                if(event.keyCode == 13)
                    $('#btn_submit').click();
            });

          break;
    
        case 'hashtags:received':

            updateGameContent(eventData);

            // Remove current player's submission from selections
            $('#vote-submission').find('button[data-package="' + sessionStorage.getItem('playerSubmission') + '"]').remove();

            // Hide voting (if player was reconnected and already voted)?
            if(playerWasReconnected && (sessionStorage.getItem('voted') === 'true'))
            {
                $('#' + $('#submitted').data('hide')).remove();
                $('#submitted').show();
            }

            break;

        case 'hashtag:tryagain':

            $('#tweet_input').val('').addClass('invalid');
            $('#tweet-submission .error').text(eventData).fadeIn();

            break;

        // Hashtag successfully submitted
        case 'hashtag:success':

            $('#countdownTimer').empty();
            $('#tweet-submission').hide();
            $('#submitted').show();

            sessionStorage.setItem('playerSubmission', eventData);

            break;

        case 'game:countdown_ending':

          if (sessionStorage.playerSubmission !== undefined && playerWasReconnected === true)
              socket.emit('game:start', {gameId: sessionStorage.gameCode});

          break;

    }

};