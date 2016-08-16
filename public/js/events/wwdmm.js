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

            var slideIndex = 0;
            $('#gameContent').html(eventData);

            $("#meme-slider").glide({
                type: "carousel",
                autoplay: false,
                autoheight: true,
                padding: '5%',
                afterTransition: function(evt) {
                    slideIndex = evt.index - 1;
                    $('#image-index').val(slideIndex);
                }
            });

            // Shrink text as length increases
            $('.meme-text').keyup(function() {
                shrinkToFill(this, 30, 3);
            });

            // Disable enter key
            $('.meme-text').keypress(function(evt) {
                if (evt.keyCode == 13)
                    evt.preventDefault();
            });
            
            break;

        case 'meme:received': 

            $('#meme-create').fadeOut(function() {
                $('#meme-created').fadeIn();
            });

            break;

        case 'meme:voting':

            var slideIndex = 0;
            $('#gameContent').html(eventData);
        
            $("#meme-slider").glide({
                type: "carousel",
                autoplay: false,
                autoheight: true,
                afterTransition: function(evt) {
                    slideIndex = evt.index - 1;
                    console.log(evt)
                }
            });
            
            // When 'vote' is clicked, send event
            $('#btn-vote').click(function() {
                
                socket.emit('meme:vote', emitData(slideIndex));

                $('#btn-vote').val('voted!').attr('disabled', true).css('opacity', '0.8');

            });

            // When 'like' is clicked, send event and set slide as liked
            $('.btn-like').click(function(evt) {

                // var slideIndex = $('#meme-slider ul li').index($('.glide__slide.active'));
                
                socket.emit('meme:like', emitData(slideIndex));
                
                $(evt.currentTarget).attr('disabled', true).css('opacity', '0.8');

            });

            break;

    }

};