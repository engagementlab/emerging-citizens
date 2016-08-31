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

    /*
        Catch socket events -- MAKE SURE ALL EVENT IDS ARE IN global.hbs
    */
    switch (eventId) {

        case 'game:start':

            sessionStorage.setItem('voted', false);
            console.log(sessionStorage.playerHashtag);
            if(sessionStorage.playerHashtag !== undefined && playerWasReconnected){
                socket.emit('hashtag:success', sessionStorage.playerHashtag);
            }

             $("#tweet_input").keydown(function(event){
                console.log("keyup");
                if(event.keyCode == 13){
                    console.log("pressed enter");
                    $('#btn_submit').click();
                }
            });
          break;

    
        case 'hashtags:received':  

            updateGameContent(eventData);

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
            console.log(sessionStorage.playerHashtag);

            break;

        case 'player:reconnected':
            playerWasReconnected = true;

          break;

        case 'game:countdown_ending':

          if (sessionStorage.playerHashtag !== undefined && playerWasReconnected === true) {
            // console.log (sessionStorage.gameCode);
              socket.emit('game:start', {gameId: sessionStorage.gameCode});
            }
          break;

    }

};