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
                var defaultFontSize = 46; // Font size (in pt)
                var f = defaultFontSize; // Font size (in pt)
                            
                var words = textClean.split(' ');
                var line = '',
                  lineTest = '',
                  lines = [],
                  currentY = 0,
                  sizeFactor = 0;
                  sizeDividend = 0;

                if(words.length > 1) {

                    console.log('width', ctxt.measureText(textClean).width)
                    ctxt.font = "bold " + f + "pt Impact, Charcoal, sans-serif";

/*                    if(ctxt.measureText(textClean).width > 500) {
                      for (; f >= 0; f -=1) {

                          ctxt.font = "bold " + f + "pt Impact, Charcoal, sans-serif";

                          console.log('new width', ctxt.measureText(textClean).width)
                          if (ctxt.measureText(textClean).width < 500) {
                            
                            console.log('size', f)
                            sizeFactor = f/defaultFontSize;
                            sizeDividend = defaultFontSize/f;
                              // ctxt.fillText(textClean, x, y);
                              // ctxt.strokeText(textClean, x, y);

                            break;
                          }

                      }
                    }

                    for (var i = 0, len = words.length; i < len; i++) {
                        lineTest = line + words[i] + ' ';

                        console.log(ctxt.measureText(lineTest).width)
                        // Check total width of line or last word
                        if (ctxt.measureText(lineTest).width > (canvas.width*sizeFactor) && i > 0) {
                          // Calculate the new height
                            if(currentY < lineHeight * 2)
                                currentY += lineHeight;
                            // else
                            //     debugger;

                          // Record and reset the current line
                          lines.push({ text: line, height: currentY });
                          line = words[i] + ' ';
                        }
                        else
                          line = lineTest;
                    }

                    // Catch last line in-case something is left over
                    if (line.length > 0) {
                        currentY = lines.length * f + f;
                        lines.push({ text: line.trim(), height: currentY });
                    }
*/
        if (TopCaptionText.length < 1) {
            TopCaptionSize = 1;
        }
        if (TopCaptionText.length == 1) {
            TopCaptionSize = 70;
        }
        if (TopCaptionText.length == 2) {
            TopCaptionSize = 68;
        }
        if (TopCaptionText.length == 3) {
            TopCaptionSize = 66;
        }
        if (TopCaptionText.length == 4) {
            TopCaptionSize = 64;
        }
        if (TopCaptionText.length == 5) {
            TopCaptionSize = 62;
        }
        if (TopCaptionText.length == 6) {
            TopCaptionSize = 61;
        }
        if (TopCaptionText.length == 7) {
            TopCaptionSize = 60;
        }
        if (TopCaptionText.length == 8) {
            TopCaptionSize = 55;
        }
        if (TopCaptionText.length == 9) {
            TopCaptionSize = 50;
        }
        if (TopCaptionText.length == 10) {
            TopCaptionSize = 45;
        }
        if (TopCaptionText.length > 10) {
            TopCaptionSize = Math.round(Math.max(((1 / (Math.pow(TopCaptionText.length, 0.14285714285714285714285714285714))) * 50 + 10), 14));
        }
        if (TopCaptionText.length > 20) {
            TopCaptionSize = Math.round(Math.max(((1 / (Math.pow(TopCaptionText.length, 0.125))) * 40 + 13), 14));
        }
        if (TopCaptionText.length > 90) {
            TopCaptionSize = Math.round(Math.max(((1 / (Math.pow((TopCaptionText.length - 80), 0.125))) * 40 + 5), 14));
        }
        if (TopCaptionText.length > 206) {
            TopCaptionSize = Math.round(Math.max(((1 / (Math.pow((TopCaptionText.length - 160), 0.125))) * 40 + 2), 14));
        }
                    // Visually output text
                    // ctxt.clearRect(0, 0, canvas.width, canvas.height);
                    // ctxt.drawImage(image, 0, 0, canvas.width, canvas.height);

                    // for (var i = 0, len = lines.length; i < len; i++) {
                    //     ctxt.fillText(lines[i].text, x, lines[i].height);
                    //     ctxt.strokeText(lines[i].text, x, lines[i].height);
                    // }

                }
                else {
                    
                    for (; f >= 0; f -=1) {
                        ctxt.font = "bold " + f + "pt Impact, Charcoal, sans-serif";

                        if (ctxt.measureText(textClean).width < canvas.width - 10) {

                            ctxt.clearRect(0, 0, canvas.width, canvas.height);
                            ctxt.drawImage(image, 0, 0, canvas.width, canvas.height);

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