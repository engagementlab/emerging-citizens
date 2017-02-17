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

            var contentHeight = window.screen.height;
            var contentWidth = window.screen.width;
            console.log(contentHeight, contentWidth);

            $('.header').fadeIn();

            var voteId = 0,
                memeImgsLoaded = false,
                imgInstance;

            sessionStorage.removeItem('playerVote');

            updateGameContent(eventData, function(animateIn) {
              if (contentHeight >= 700) {

                if (contentWidth >= 375) {
                  var memeHeight = 340;
                } else {
                  var memeHeight = 300;
                }

              } else {

                if (contentWidth >= 375) {
                  var memeHeight = 320;
                } else {
                  var memeHeight = 288;
                }
                
              }

              var dimensions = (window.innerWidth >= 400) ? memeHeight : memeHeight;

              // Do not allow player to submit more than once
              if(sessionStorage.getItem('playerSubmission')) {
                gameEvents('meme:received', {random: false});
                animateIn();

                return;
              }

              imageLoaded($("#meme-slider"), function() {

                
                $('#meme-create').css("height", contentHeight - 300);

                $("#meme-slider").glide({
                  type: "carousel",
                  autoplay: false,
                  autoheight: true,
                  afterTransition: function(evt) {
                      voteId = evt.index - 1;
                      $('#image-index').val(voteId);
                  }
                });

                if(!memeImgsLoaded) {
                  animateIn();
                  memeImgsLoaded = true;
                }

              }, true);

              
          
              var canvas = new Kinetic.Stage({
                  container: 'meme-canvas',
                  width: memeHeight,
                  height: memeHeight
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
                  caption.fontSize(getFontSize(txtElement.val()) * 0.8);
                  

                  lowerCaption.setY(canvas.getHeight() - lowerCaption.getHeight() - 40);

                  layer.draw();

                  var fontsize = getFontSize(txtElement.val() * 0.8);
              
              }

              $('input#btn-next').click(function(evt) {

                  var imgElement = $('.glide__slide.active img')[0];
                  
                  if(!imgInstance) {
                      imgInstance = new Kinetic.Image({
                                      x: 0,
                                      y: 0,
                                      width: canvas.getHeight(),
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

                  $('input#btn-next').hide();
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

              // Submit meme on enter key
              $(".meme-text").keydown(function(evt) {
                if(evt.keyCode == 13)
                  $('#btn-submit').click();
              });

              // Mobile keyboard workaround
              $('#btn-submit').on('touchend', function(evt) {
                $('#btn-submit').submit();
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

            if (eventData.random == true)
              sessionStorage.setItem('playerSubmission', eventData.player);
            
            else {
           
              $('#meme-create').fadeOut(function() {
                $('#meme-create').parent('.form').css('display', 'none');
                $('#meme-created').fadeIn();
              });

              sessionStorage.setItem('playerSubmission', eventData.player);

              loadToggle(false);

            }

            break;            

        case 'meme:voting':

            var voteId = 0;

            updateGameContent(eventData, function() {

              if (contentHeight >= 700) {

                if (contentWidth >= 375) {
                  var memeHeight = 340;
                } else {
                  var memeHeight = 300;
                }

              } else {

                if (contentWidth >= 375) {
                  var memeHeight = 320;
                } else {
                  var memeHeight = 288;
                }
                
              }

                $('#meme-slider').find('li.glide__slide[data-id="' + sessionStorage.getItem('playerSubmission') + '"]').remove();
            
                $("#meme-slider").glide({
                  type: "carousel",
                  autoplay: false,
                  afterInit: function(evt) {
                      voteId = $(evt.current[0]).data('id');
                  },
                  afterTransition: function(evt) {
                      voteId = $(evt.current[0]).data('id');
                  }
                });

                $.each($('.meme-canvas'), function(index, meme) {

                  var upperText = $(meme).data().upper ? $(meme).data().upper.toString().toUpperCase() : '',
                      lowerText = $(meme).data().lower ? $(meme).data().lower.toString().toUpperCase() : '',
                      dimensions = (window.innerWidth >= 400) ? 400 : memeHeight;

                  // caption.fontSize(getFontSize(txtElement.val()) * 0.8);

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
                    upperCaption.fontSize(getFontSize(upperText) * 0.8);
                    lowerCaption.fontSize(getFontSize(lowerText) * 0.8);

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
                  
                  socket.emit('meme:vote', emitData(voteId));

                  $(evt.currentTarget).val('voted!').attr('disabled', true).css({'opacity': '0.3'});

                  sessionStorage.setItem('playerVote', voteId);

              });

              if(sessionStorage.getItem('playerVote'))
                $('#btn-vote').val('voted!').attr('disabled', true).css({'opacity': '0.3'});

            });

            break;

    }

};