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

        case 'game:start':

            $('.header').fadeIn();

            var slideIndex = 0,
                imgInstance;

            updateGameContent(eventData, function(animateIn) {
              var dimensions = (window.innerWidth >= 400) ? 400 : window.innerWidth;

              // Do not allow player to submit more than once
              if(sessionStorage.getItem('playerSubmission')) {
                gameEvents('meme:received');
                return;
              }

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

                animateIn();

              });
          
              var canvas = new Kinetic.Stage({
                  container: 'meme-canvas',
                  width: dimensions,
                  height: 400
              }),
              layer = new Kinetic.Layer();
              canvas.add(layer);

              var upperCaption = new Kinetic.Text({
                  name: 'upper',
                  x: 0,
                  y: 40,
                  text: '',
                  fontSize: 46,
                  fontFamily: 'Impact, "Impact-External"',
                  fill: '#fff',
                  stroke: '#000',
                  strokeWidth: 2,
                  lineJoin: 'round',
                  width: dimensions,
                  align: 'center'
              }),
              lowerCaption = new Kinetic.Text({
                  name: 'lower',
                  x: 0,
                  y: 400,
                  text: '',
                  fontSize: 46,
                  fontFamily: 'Impact, "Impact-External"',
                  fill: '#fff',
                  stroke: '#000',
                  strokeWidth: 2,
                  lineJoin: 'round',
                  width: dimensions,
                  align: 'center'
              });

              var writeText = function(txtElement) {

                  var caption = (txtElement.attr('id') === 'text-upper') ? upperCaption : lowerCaption;

                  caption.setText(txtElement.val().toUpperCase());
                  caption.fontSize(getFontSize(txtElement.val()));

                  lowerCaption.setY(canvas.getHeight() - lowerCaption.getHeight() - 40);

                  layer.draw();
              
              }

              $('#btn-next input').click(function(evt) {

                  var imgElement = $('.glide__slide.active img')[0];
                  
                  if(!imgInstance) {
                      imgInstance = new Kinetic.Image({
                                      x: 0,
                                      y: 0,
                                      width: canvas.getWidth(),
                                      height: canvas.getHeight(),
                                      image: imgElement
                                    });
                      
                      layer.add(imgInstance);
                      layer.add(upperCaption);
                      layer.add(lowerCaption);
                  }
                  else
                      imgInstance.setImage(imgElement);
                  
                  layer.draw();

                  $('#btn-next').hide();
                  $('#meme-slider').hide();
                  $('#meme-text').show();

                  $('#btns-submit').show();

              });

              $('#btn-back').click(function(evt) {
              
                  $('#meme-slider').show();
                  $('#meme-text').hide();

                  $('#btn-next').show();
                  $('#btns-submit').hide();

              });

              // Write text to canvas as player types
              $('.meme-text').keyup(function(evt) {
                  writeText($(evt.currentTarget));
              });

            }, true);

            break;

        case 'meme:tryagain': 

            $('.error').text(eventData).fadeIn();
            $('#btn-submit').removeAttr('disabled');
            
            loadToggle(false, true);

          
          break;

        case 'meme:received': 

            $('#meme-create').fadeOut(function() {
                $('#meme-created').fadeIn();
            });

            sessionStorage.setItem('playerSubmission', eventData);
            
            loadToggle(false);

            break;

        case 'meme:voting':

            var slideIndex = 0;

            updateGameContent(eventData, function() {

                $('#meme-slider').find('li.glide__slide[data-id="' + sessionStorage.getItem('playerSubmission') + '"]').remove();
            
                $("#meme-slider").glide({
                    type: "carousel",
                    autoplay: false,
                    afterTransition: function(evt) {
                        slideIndex = evt.index - 1;
                    }
                });

                $.each($('.meme-canvas'), function(index, meme) {

                  var upperText = $(meme).data().upper ? $(meme).data().upper.toUpperCase() : '',
                      lowerText = $(meme).data().lower ? $(meme).data().lower.toUpperCase() : '',
                      dimensions = (window.innerWidth >= 400) ? 400 : window.innerWidth;

                  // Create meme canvas, render layer, captions, and image
                  var canvas = new Kinetic.Stage({
                      container: $(meme)[0],
                      width: dimensions,
                      height: dimensions
                  }),
                  layer = new Kinetic.Layer(),
                  upperCaption = new Kinetic.Text({
                      name: 'upper',
                      x: 0,
                      y: 20,
                      text: upperText,
                      fontSize: 46,
                      fontFamily: 'Impact, "Impact-External"',
                      fill: '#fff',
                      stroke: '#000',
                      strokeWidth: 2,
                      lineJoin: 'round',
                      width: dimensions,
                      align: 'center'
                  }),
                  lowerCaption = new Kinetic.Text({
                      name: 'lower',
                      x: 0,
                      y: 150,
                      text: lowerText,
                      fontSize: 46,
                      fontFamily: 'Impact, "Impact-External"',
                      fill: '#fff',
                      stroke: '#000',
                      strokeWidth: 2,
                      lineJoin: 'round',
                      width: dimensions,
                      align: 'center'
                  });

                  // Add all elements to render layer
                  var memeImg = new Image();
                  memeImg.onload = function() {

                    var imgInstance = new Kinetic.Image({
                        x: 0,
                        y: 0,
                        width: canvas.getWidth(),
                        height: canvas.getHeight(),
                        image: memeImg
                    });
                    layer.add(imgInstance);
                    layer.add(upperCaption);
                    layer.add(lowerCaption);

                    // Set caption font sizing and lower caption position
                    upperCaption.fontSize(getFontSize(upperText));
                    lowerCaption.fontSize(getFontSize(lowerText));

                    lowerCaption.setY(canvas.getHeight() - lowerCaption.getHeight() - 40);

                    // Add layer to canvas
                    canvas.add(layer);

                    // Draw layer
                    layer.draw();

                  }
                  memeImg.src = $(meme).data().img;

                });
            
              // When 'vote' is clicked, send event
              $('#btn-vote').click(function(evt) {
                  
                  socket.emit('meme:vote', emitData(slideIndex));

                  $(evt.currentTarget).val('voted!').attr('disabled', true).css({'opacity': '0.3'});

              });

            });

            break;

    }

};