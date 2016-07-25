/**
 * Emerging Citizens
 * Developed by Engagement Lab, 2016
 * ==============
 * 
 * Script for PLAYERS' HTYI socket events. Loaded to client upon successful login.
 * ==========
 */

var playerWasReconnected;

//Add game type class to body
$('.body').addClass('htyi');

var gameEvents = function(eventId, eventData) {

    switch (eventId) {

        case 'game:start':

          sessionStorage.setItem('voted', false);

          break;

    
        case 'hashtags:received':  

            // TODO: Server-side?    
            $('#gameContent').html(eventData);

            // Remove current player's submission from selections
            $('#vote-submission').find('button[data-package="' + sessionStorage.getItem('playerHashtag') + '"]').remove();

            // Hide voting (if player was reconnected and already voted)?
            if(this.playerWasReconnected && (sessionStorage.getItem('voted') === 'true'))
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

            sessionStorage.setItem('playerHashtag', eventData);

            break;

    }

};