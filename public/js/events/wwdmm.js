/**
 * Emerging Citizens
 * Developed by Engagement Lab, 2016
 * ==============
 * 
 * Script for PLAYERS' WWDMM socket events. Loaded to client upon successful login.
 * ==========
 */

var playerWasReconnected = (sessionStorage.getItem('reconnected') === 'true');

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

        case 'meme:create':

            var slideIndex = 0;
            var topFontSize = 46;

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

            var canvas = new Kinetic.Stage({
                            container: 'meme-canvas',
                            width: 500,
                            height: 500
                         });

            var layer = new Kinetic.Layer();
            canvas.add(layer);

            var caption = new Kinetic.Text({
                name: 'stroke',
                x: 0,
                y: 40,
                text: '',
                fontSize: topFontSize,
                fontFamily: 'Impact',
                fill: '#fff',
                stroke: '#000',
                strokeWidth: 2,
                lineJoin: 'round',
                width: 450,
                align: 'center'
            });

            function getFontSize(txt) {

                if (txt.length < 1) {
                    topFontSize = 1;
                }
                if (txt.length == 1) {
                    topFontSize = 70;
                }
                if (txt.length == 2) {
                    topFontSize = 68;
                }
                if (txt.length == 3) {
                    topFontSize = 66;
                }
                if (txt.length == 4) {
                    topFontSize = 64;
                }
                if (txt.length == 5) {
                    topFontSize = 62;
                }
                if (txt.length == 6) {
                    topFontSize = 61;
                }
                if (txt.length == 7) {
                    topFontSize = 60;
                }
                if (txt.length == 8) {
                    topFontSize = 55;
                }
                if (txt.length == 9) {
                    topFontSize = 50;
                }
                if (txt.length == 10) {
                    topFontSize = 45;
                }
                if (txt.length > 10) {
                    topFontSize = Math.round(Math.max(((1 / (Math.pow(txt.length, 0.14285714285714285714285714285714))) * 50 + 10), 14));
                }
                if (txt.length > 20) {
                    topFontSize = Math.round(Math.max(((1 / (Math.pow(txt.length, 0.125))) * 40 + 13), 14));
                }
                if (txt.length > 90) {
                    topFontSize = Math.round(Math.max(((1 / (Math.pow((txt.length - 80), 0.125))) * 40 + 5), 14));
                }
                if (txt.length > 206) {
                    topFontSize = Math.round(Math.max(((1 / (Math.pow((txt.length - 160), 0.125))) * 40 + 2), 14));
                }

                return topFontSize;

            }

            var writeText = function(txt) {

              caption.setText(txt);
              caption.fontSize(getFontSize(txt))

              layer.draw();
            
            }
            var renderMeme = function() {

                writeText($('#text-upper').val());
                // writeText($(bottomline).val(), canvas.width / 2, canvas.height - 20);

            };

            $('#btn_next input').click(function(evt) {

                var imgElement = $('.glide__slide.active img')[0];
                var imgInstance = new Kinetic.Image({ x: 0, y: 0, width: 500, height: 500, image: imgElement });
                
                layer.add(imgInstance);
                layer.add(caption);
                
                layer.draw();

                $(evt.currentTarget).hide();
                $('#meme-slider').hide();
                $('#meme-text').show();

            });

            // Shrink text as length increases
            $('.meme-text').keyup(function() {
                renderMeme();
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