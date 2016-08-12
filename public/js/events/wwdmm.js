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
    
    var txtInput = $(input),
        txt = txtInput.val(),
        maxWidth = 30,
        defaultFontSize = 3;

    if (txt.length > maxWidth) {

        // Calculate a new font size
        var fontSize = defaultFontSize * maxWidth / txt.length * 1.1;
        
        // Set the style on the input
        txtInput.css('fontSize', fontSize + 'em');

    }
    else
        txtInput.css('fontSize', defaultFontSize + 'em');

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

            var slideIndex = 0;
            $('#gameContent').html(eventData);

            $("#meme-slider").glide({
                type: "carousel",
                autoplay: false,
                autoheight: true,
                centered: true,
                afterTransition: function(evt) {
                    slideIndex = evt.index - 1;
                    $('#image-index').val(slideIndex);
                }
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