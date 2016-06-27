//Define vars/functions/objects

var $topMenu = $("#menuImage");
var $contextPane = $("#contextPane");
var $q1 = $("#q1");
var $q2 = $("#q2");
var $q3 = $("#q3");
var $q4 = $("#q4");
var $timer = $("#timer");
var $strokes = $("#strokes")


//code body
TweenMax.from($topMenu, .5, {y:-300, ease:Circ.easeOut});
TweenMax.from($contextPane, .75, {rotation: 180, y:500});
TweenMax.fromTo($q1, 1, {opacity:0.0}, {opacity:1.0, delay:.8});
TweenMax.fromTo($q2, 1, {opacity:0.0}, {opacity:1.0, delay:1.5});
TweenMax.fromTo($q3, 1, {opacity:0.0}, {opacity:1.0, delay:1.75});
TweenMax.fromTo($q4, 1, {opacity:0.0}, {opacity:1.0, delay:1.25});


function countdown( elementName, minutes, seconds )
{
    var element, endTime, hours, mins, msLeft, time;

    function twoDigits( n )
    {
        return (n <= 9 ? "0" + n : n);
    }

    function updateTimer()
    {
        msLeft = endTime - (+new Date);
        if ( msLeft < 1000 ) {
            element.innerHTML = "Out of time!";
            timerDone=true;
            if (timerDone==true){
				TweenMax.fromTo($q1, 1, {opacity:1.0}, {opacity:0.0, delay:.5});
				TweenMax.fromTo($q2, 1, {opacity:1.0}, {opacity:0.0, delay:1.25});
				TweenMax.fromTo($q3, 1, {opacity:1.0}, {opacity:0.0, delay:1.75});
				TweenMax.fromTo($q4, 1, {opacity:1.0}, {opacity:0.0, delay:1});
				TweenMax.fromTo($strokes, 1, {opacity:1.0}, {opacity:0.0, delay:2.5});
				}
        } else {
            time = new Date( msLeft );
            hours = time.getUTCHours();
            mins = time.getUTCMinutes();
            element.innerHTML = (hours ? hours + ':' + twoDigits( mins ) : mins) + ':' + twoDigits( time.getUTCSeconds() );
            setTimeout( updateTimer, time.getUTCMilliseconds() + 500 );
        }
    }

    element = document.getElementById( elementName );
    endTime = (+new Date) + 1000 * (60*minutes + seconds) + 500;
    updateTimer();
}

countdown("timer", 0, 32);
console.log(timerDone);

$("#contextLink").click(function (e) {
    e.preventDefault();                   // prevent default anchor behavior
    var goTo = this.getAttribute("href"); // store anchor href

    // do something while timeOut ticks ... 

    setTimeout(function(){
         window.location = goTo;
    },3000);       
}); 