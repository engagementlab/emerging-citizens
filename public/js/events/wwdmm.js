/**
 * Emerging Citizens
 * Developed by Engagement Lab, 2016
 * ==============
 * 
 * Script for PLAYERS' WWDMM socket events. Loaded to client upon successful login.
 * ==========
 */

 var playerWasReconnected;

 window.addEventListener("beforeunload", function (e) {
 	(e || window.event).returnValue = null;
 	return null;

 });

// Add game type class to body
$('.body').addClass('wwdmm');

var gameEvents = function(eventId, eventData) {

    /*
	    Catch socket events -- MAKE SURE ALL EVENT IDS ARE IN global.hbs
    */
    switch (eventId) {

    	case 'game:start':

        	break;

    	case 'player:reconnected':

        	playerWasReconnected = true;

        	break;

        case 'meme:create':

            $('#gameContent').html(eventData);

            var slider = $('#meme-slider').unslider({
                nav: false
            });
            slider.on('unslider.change', function(event, index, slide) {
                $('#image-index').val(index);
            });

            break;

        case 'meme:voting':

            $('#gameContent').html(eventData);
        
            var slider = $('#meme-slider').unslider();
            
            // When 'vote' is clicked, send event and set slide as voted on
            $('#btn-vote').click(function() {

                var slideIndex = $('#meme-slider ul li').index($('.unslider-active'));
                
                socket.emit('meme:vote', emitData(slideIndex));

                // $(slides[slideIndex]).data({'voted': true});

                $('#btn-vote').css('display', 'none');
                $('#voted').css('display', 'block');

            });

            break;

    }

};