var $title = $('h1');
var $subtitle = $('h2');
var $timer = $('#timer')
var $output = $('#output');
//This is the code for bouncing the box
//You can change the numbers to vary the speed and elasticity of the animation
TweenMax.to($timer, 1, {
    scale: 1.25,
    ease: Elastic.easeOut.config(.5, .1)
});
TweenLite.fromTo($title, 2, {
    x: '-=750px'
}, {
    x: 650,
    ease: Elastic.easeInOut,
    onStart: start,
    onUpdate: update,
    onComplete: complete
});
//TweenLite is the library and fromTo is the movement we are going to use to make the title slide in
//$title indicates what we will be sliding in
//2 indicates the speed that the object will slide in. Larger# = slower
//x='-=###' indicates how far off the screen the object starts
//X:### indicates how far the object will slie in
//ease is what kind of animation we are using
//Elastic is the style/speed it ocmes in.
//easeInOut is a specific movement w/in the perameters of ealstic
TweenLite.fromTo($subtitle, 2, {
    x: '2000x'
}, {
    x: 700,
    ease: Elastic.easeInOut,
    delay: 1,
    onStart: start,
    onUpdate: update,
    onComplete: complete
});
// 7. Callback functions
/*TWEET BOX*/
TweenMax.fromTo(".gsap", 4, {
    maxHeight: 0
}, {
    maxHeight: 400,
    ease: Quint.easeOut,
    onUpdate: applyValue,
    onUpdateParams: ["{self}"]
});

function applyValue(tween) {
        output.html(tween.target.maxHeight);
    }

//CLOCK/////////////////////////
////////////////////////////////

//use requestAnimationFrame for smoothness (shimmed with setTimeout fallback)
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
              window.setTimeout(callback, 1000 / 60);
          };
})();

//initialize the clock in a self-invoking function
(function clock(){ 
    var hour = document.getElementById("hour"),
        min = document.getElementById("min"),
        sec = document.getElementById("sec");
    //set up a loop
    (function loop(){
        requestAnimFrame(loop);
        draw();
    })();
    //position the hands
    function draw(){
        var now = new Date(),//now
            then = new Date(now.getFullYear(),now.getMonth(),now.getDate(),0,0,0),//midnight
            diffInMil = (now.getTime() - then.getTime()),// difference in milliseconds
            h = (diffInMil/(1000*60*60)),//hours
            m = (h*60),//minutes
            s = (m*60);//seconds
        //rotate the hands accordingly
        sec.style.webkitTransform = "rotate(" + (s * 6) + "deg)";
        hour.style.webkitTransform = "rotate(" + (h * 30 + (h / 2)) + "deg)";
        min.style.webkitTransform = "rotate(" + (m * 6) + "deg)";
    } 
})();








function start() {
    console.log('start');
}

function update() {
    console.log('animating');
}

function complete() {
    console.log('end');
}