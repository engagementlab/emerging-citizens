/**
 * Emerging Citizens
 * Developed by Engagement Lab, 2016
 * ==============
 * 
 * Script for PLAYERS' WWDMM socket events. Loaded to client upon successful login.
 * ==========
 */

 var playerWasReconnected;

 var shrinkToFill = function(input) {
    var $input = $(input),
        txt = $input.val(),
        maxWidth = 70, // add some padding
        font;

    debugger;

    if (txt.length > maxWidth) {
        // if it's too big, calculate a new font size
        // the extra .9 here makes up for some over-measures
        fontSize = fontSize * maxWidth / txt.length * .9;
        font = 'bold ' + fontSize + 'px Avenir';
        // and set the style on the input
        $input.css({font:font});
    } else {
        // in case the font size has been set small and 
        // the text was then deleted
        $input.css({font:font});
    }
}

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

            /*var slider = $('#meme-slider').unslider({
                nav: false,
                arrows: {
                    prev: '<a class="unslider-arrow prev desktop-only"><<</a>',
                    next: '<a class="unslider-arrow next desktop-only">>></a>'
                }
            });
            slider.on('unslider.change', function(event, index, slide) {
                $('#image-index').val(index);
            });
*/
            $("#meme-slider").glide({
                type: "carousel",
                autoplay: false,
                autoheight: true
            });

            $('#text-upper').keyup(function() {
                shrinkToFill(this);
            });
            
            break;

        case 'meme:received': 

            $('#meme-create').fadeOut(function() {
                $('#meme-created').fadeIn();
            });

            break;

        case 'meme:voting':

            $('#gameContent').html(eventData);
        
            var slider = $('#meme-slider').unslider();
            
            // When 'vote' is clicked, send event
            $('#btn-vote').click(function() {

                var slideIndex = $('#meme-slider ul li').index($('.unslider-active'));
                
                socket.emit('meme:vote', emitData(slideIndex));

                $('#btn-vote').val('voted!').attr('disabled', true).css('opacity', '0.8');

            });

            // When 'like' is clicked, send event and set slide as liked
            $('.btn-like').click(function(evt) {

                var slideIndex = $('#meme-slider ul li').index($('.unslider-active'));
                
                socket.emit('meme:like', emitData(slideIndex));
                
                $(evt.currentTarget).attr('disabled', true).css('opacity', '0.8');

            });

            break;

    }

};