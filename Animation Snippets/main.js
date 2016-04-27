var $box = $('#banner');

//This is the code for bouncing the box
//You can change the numbers to vary the speed and elasticity of the animation
TweenMax.to("#scalerbox", 1, {scale:1.5, ease:Elastic.easeOut.config(.5,.1)});
TweenMax.to("#scalerbox1", 1, {scale:2, ease:Elastic.easeOut.config(10,1),delay:1});
TweenMax.to("#scalerbox2", 1, {scale:2.5, ease:Elastic.easeOut.config(.5,.8),delay:2});
TweenMax.to("#scalerbox3", 1, {scale:100, ease:Elastic.easeOut.config(.5,.1),delay:10});


TweenLite.fromTo($box, 2, {x: '-=200px'}, {x: 800, ease:Power4.easeInOut,
 onStart: start, onUpdate: update, onComplete: complete});

TweenLite.fromTo($box2, 2, {x: '-=200px'}, {x: 800, ease:Power4.easeInOut,
 onStart: start, onUpdate: update, onComplete: complete});

// 7. Callback functions
function start(){
  console.log('start');
}

function update(){
  console.log('animating');
}

function complete(){
  console.log('end');
}


var $cursor = $("#cursor"),
  revealInterval = 0.1,
  mySplitText = new SplitText("#txt", {type:"words,chars", charsClass:"char", position:"absolute"}), 
  $chars = $(".char"),
  tl =  new TimelineMax({delay:1, yoyo:true, repeatDelay:1,  onRepeat:function(){
  //stops blinking
  TweenLite.set($cursor, {opacity:true})
}});

tl.call(blink) // this makes the cursor resume blinking after reversing
tl.set($cursor, {opacity:1}, 0.1) // this makes it visible (not blinking) when playing forward

//loop throug all the chars and make them visible AND set cursor to their right at same time
$chars.each(function(index, element){
  var $element = $(element);
  var offset = $element.offset();
  var width = $element.width()
  tl.set($cursor, {left:offset.left + width,  top:offset.top}, (index +1) * revealInterval)
  tl.set($element, {autoAlpha:1}, (index +1) * revealInterval) 
})

tl.call(blink)// resume blinking after last character is revealed

//enable the blinking cursor
function blink(){
  TweenMax.fromTo($cursor, 0.5, {opacity:0}, {opacity:1, repeat:-1, ease:SteppedEase.config(1)})
}

//get goin
   
TweenLite.set("#textHolder", {visibility:"visible"});
tl.timeScale(0.7)
blink();
