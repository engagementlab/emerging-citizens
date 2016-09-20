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

            var reader = new FileReader(),
            image = new Image(),
            ctxt = null, // For canvas' 2d context
            
            // Get elements (by id):
            box1 = $("#box1"),
            ifile = $("#ifile"),
            box2 = $("#box2"),
            topline = $("#text-upper"),
            bottomline = $("#text-lower"),
            canvas = document.getElementById("meme-canvas"), // canvas;
            // Get canvas context:
            ctxt = canvas.getContext("2d");
            
            function wrapText(text, x, y) {

              }

            var writeText = function (text, x, y, lineHeight) {
                var textClean = text.toUpperCase();
                var f = 46; // Font size (in pt)
                            
                var words = textClean.split(' ');
                var line = '';

                  var totalWidth = ctxt.measureText(textClean).width;

                if(words.length > 1) {

                    if(totalWidth > (canvas.width*2)) {
                        
                        for (; f >= 0; f -=1) {

                            // ctxt.font = "bold " + f + "pt Impact, Charcoal, sans-serif";

                            if (ctxt.measureText(textClean).width < canvas.width - 10) {

                                // ctxt.fillText(textClean, x, y);
                                // ctxt.strokeText(textClean, x, y);
                                
                                break;
                            }
                        }

                    }

                    var testWidth;
                    // var totalWidth = 0;

                    for(var n = 0; n < words.length; n++) {

                      var testLine = line + words[n] + ' ';
                      console.log('testLine', testLine)

                      var metrics = ctxt.measureText(testLine);
                      
                      testWidth = metrics.width;
                      
                      if(n === words.length-1)
                          totalWidth = testWidth;
                          
                          ctxt.font = "bold " + f + "pt Impact, Charcoal, sans-serif";
                        
                        if (testWidth > canvas.width && n > 0) {
                            ctxt.fillText(line, x, y);
                            ctxt.strokeText(line, x, y);

                            line = words[n] + ' ';
                            
                            if(y < lineHeight * 2)
                                y += lineHeight;
                        }
                        else {
                            line = testLine;
                        }

                    }

                    console.log('totalWidth', totalWidth)

                    ctxt.fillText(line, x, y);
                    ctxt.strokeText(line, x, y);

                }
                else {
                    
                    for (; f >= 0; f -=1) {
                        ctxt.font = "bold " + f + "pt Impact, Charcoal, sans-serif";

                        if (ctxt.measureText(textClean).width < canvas.width - 10) {

                            ctxt.fillText(textClean, x, y);
                            ctxt.strokeText(textClean, x, y);
                            
                            break;
                        }
                    }

                }
            };

            var renderMeme = function () {
                
                canvas.width = image.width;
                canvas.height = image.height;

                ctxt.clearRect(0, 0, canvas.width, canvas.height);
                ctxt.drawImage(image, 0, 0, canvas.width, canvas.height);

                ctxt.textAlign = "center";
                ctxt.fillStyle = "white";
                ctxt.strokeStyle = "black";
                ctxt.lineWidth = 2;

                writeText($(topline).val(), canvas.width / 2, 50, 50);
                // writeText($(bottomline).val(), canvas.width / 2, canvas.height - 20);

            };

            $('#btn_next input').click(function(evt) {

                image.onload = function() {
                    renderMeme();
                };

                image.src = $('.glide__slide.active img').attr('src');
                
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