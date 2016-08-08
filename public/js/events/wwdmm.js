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

            var slideIndex = 0;            
            var slider = $('#meme-slider').unslider({
                
            });
            slider.on('unslider.change', function(event, index, slide) {
                slideIndex = index;

                var voted = ($(slide[0]).data('voted') == 'true')
                
                $('#btn-vote').css('display', (voted ? 'none' : 'block'));
                $('#voted').css('display', (voted ? 'block' : 'none'));
            });

            $('#btn-vote').click(function() {

                socket.emit('meme:vote', emitData({
                    imageIndex: slideIndex 
                }));

                $($('#meme-slider ul li')[slideIndex]).data('voted', 'true');

            });

            break;

    }

};