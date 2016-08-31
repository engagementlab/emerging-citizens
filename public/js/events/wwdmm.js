/**
 * Emerging Citizens
 * Developed by Engagement Lab, 2016
 * ==============
 * 
 * Script for PLAYERS' WWDMM socket events. Loaded to client upon successful login.
 * ==========
 */

var playerWasReconnected;

/**
 * Waits for the first child image in the provided element to load and then dispatches provided callback.
 * @module utils
 * @param {jQuery selector} parentElem - The parent element containing image.
 * @param {function} callback - The callback function.
 */
var imageLoaded = function(parentElem, callback) {

  parentElem.find('img').first().on('load', function() {

    // Image loaded, callback fires
    callback();

  })
  .each(function() {

    // Force image to dispatch 'load' (cache workaround)
    if(this.complete) $(this).load();

  });

};

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

            updateGameContent(eventData, function() {

                imageLoaded($("#meme-slider"), function() {

                  $("#meme-slider").glide({
                        type: "carousel",
                        autoplay: false,
                        autoheight: true,
                        afterTransition: function(evt) {
                            slideIndex = evt.index - 1;
                            $('#image-index').val(slideIndex);
                        }
                    });
                    

                });

            });

            // Shrink text as length increases
            $('.meme-text').keyup(function() {
                shrinkToFill(this, 340, 46);
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

            updateGameContent(eventData, function() {
                
                // imageLoaded($("#meme-slider"), function() {
            
                    $("#meme-slider").glide({
                        type: "carousel",
                        autoplay: false,
                        afterTransition: function(evt) {
                            slideIndex = evt.index - 1;
                        }
                    });

                    $.each($('.meme-text'), function(ind, txt) {
                        shrinkToFill(txt, 340, 46);
                    });

                // });

            });
            
            // When 'vote' is clicked, send event
            $('#btn-vote').click(function(evt) {
                
                socket.emit('meme:vote', emitData(slideIndex));

                $(evt.currentTarget).val('voted!').attr('disabled', true).css({'opacity': '0.3'});

            });

            // When 'like' is clicked, send event and set slide as liked
            $('.btn-like').click(function(evt) {

                // var slideIndex = $('#meme-slider ul li').index($('.glide__slide.active'));
                
                socket.emit('meme:like', emitData(slideIndex));
                
                $(evt.currentTarget).attr('disabled', true).css('opacity', '0.3');
                TweenLite.to($(evt.currentTarget), 0.5, {scale: 0.7, ease: Bounce.easeOut});

            });

            break;

    }

};