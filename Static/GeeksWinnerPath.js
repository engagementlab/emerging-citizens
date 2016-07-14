//declare vars and functions

var $pathContainer = $("#pathContainer");
var $targetHeader = $("#targetHeader");
var $targetStroke = $("#targetStroke");
var $targetName = $("#targetName");
var $winnerContainer = $("#winnerContainer");
var $winnerName = $("#winnerName");
var $place = $("#place");
var $clicks = $("#clicks");
var $clickNo = $("#clickNo");
var $points = $("#points");
var $pointsNo = $("#pointsNo");
var $timeSpent = $("#timeSpent");
var $roundInfo = $("#roundInfo");
var $point1 = $("#point1");
var $point2 = $("#point2");
var $point3 = $("#point3");
var $point4 = $("#point4");
var $point5 = $("#point5");
var $point6 = $("#point6");
var $point7 = $("#point7");
var $point8 = $("#point8");
var $point9 = $("#point9");
var $point10 = $("#point10");
var $point11 = $("#point11");
var $point12 = $("#point12");
var $point13 = $("#point13");
var $point14 = $("#point14");
var $point15 = $("#point15");
var $point16 = $("#point16");
var $point17 = $("#point17");
var $point18 = $("#point18");
var $point19 = $("#point19");
var $point20 = $("#point20");
var $connector1 = $("#connector1");
var $connector2 = $("#connector2");
var $connector3 = $("#connector3");
var $connector4 = $("#connector4");
var $connector5 = $("#connector5");
var $connector6 = $("#connector6");
var $connector7 = $("#connector7");
var $connector8 = $("#connector8");
var $connector9 = $("#connector9");
var $connector10 = $("#connector10");
var $connector11 = $("#connector11");
var $connector12 = $("#connector12");
var $connector13 = $("#connector13");
var $connector14 = $("#connector14");
var $connector15 = $("#connector15");
var $connector16 = $("#connector16");
var $vertical1 = $("#vertical1");
var $vertical2 = $("#vertical2");
var $vertical3 = $("#vertical3");
var $name1 = $("#name1");
var $name2 = $("#name2");
var $name3 = $("#name3");
var $name4 = $("#name4");
var $name5 = $("#name5");
var $name6 = $("#name6");
var $name7 = $("#name7");
var $name8 = $("#name8");
var $name9 = $("#name9");
var $name10 = $("#name10");
var $name11 = $("#name11");
var $name12 = $("#name12");
var $name13 = $("#name13");
var $name14 = $("#name14");
var $name15 = $("#name15");
var $name16 = $("#name16");
var $name17 = $("#name17");
var $name18 = $("#name18");
var $name19 = $("#name19");
var $name20 = $("#name20");
var $finalFlare = $("#finalFlare");

var clicks = 0;

function connector(nextPoint, nextName, nextConnector, delayLength)
{
	nextPoint.css("visibility", "visible");
	TweenMax.fromTo(nextPoint, .5, {scale:0},{scale:1, delay: 4.25 + delayLength, ease: Elastic.easeOut, onRepeat:onRepeat, repeat:1});
	nextName.css("visibility", "visible");
	TweenMax.fromTo(nextName, .5, {scale:0},{scale:1, delay: 4.5 + delayLength, ease: Elastic.easeOut});
	nextConnector.css("visibility", "visible");
	TweenMax.fromTo(nextConnector, .5, {opacity:0}, {opacity:1, delay: 4.5 + delayLength});
}

function onRepeat(){
	clicks++;
	document.getElementById("clickNo").innerHTML=clicks;
	TweenMax.fromTo($clickNo, .5, {scale:1}, {scale:2, ease:Elastic.easeOut});
	document.getElementById("pointsNo").innerHTML= 100;
}

///////////////////////////////////////////////////////////////////////////////////////////////

$(function(){


//start main reveal code
TweenMax.from($pathContainer, .5, {width:800, height:600});
$targetHeader.css("visibility", "visible");
TweenMax.fromTo($targetHeader, .5, {opacity:0}, {opacity:1, delay: 1});
$targetStroke.css("visibility", "visible");
TweenMax.fromTo($targetStroke, .5, {opacity:0}, {opacity:1, delay: 1});
$winnerContainer.css("visibility", "visible");
TweenMax.fromTo($winnerContainer, .5, {opacity:0}, {opacity:1, delay: 1});
$targetName.css("visibility", "visible");
TweenMax.fromTo($targetName, .5, {opacity:0}, {opacity:1, delay: 2});
$place.css("visibility", "visible");
TweenMax.fromTo($place, .5, {opacity:0}, {opacity:1, delay: 2.75});
$winnerName.css("visibility", "visible");
TweenMax.fromTo($winnerName, .5, {opacity:0}, {opacity:1, delay: 2.5});
$timeSpent.css("visibility", "visible");
TweenMax.fromTo($timeSpent, .5, {opacity:0}, {opacity:1, delay: 3});
TweenMax.to($timeSpent, .5, {scale:1.5, delay:3, ease:Elastic.easeIn});
$points.css("visibility", "visible");
TweenMax.fromTo($points, .5, {opacity:0}, {opacity:1, delay: 3});
$clicks.css("visibility", "visible");
TweenMax.fromTo($clicks, .5, {opacity:0}, {opacity:1, delay: 3});

//clickmap code

//connection 1
$point1.css("visibility", "visible");
TweenMax.fromTo($point1, .5, {scale:0},{scale:1, delay: 3.75, ease: Elastic.easeOut})
$name1.css("visibility", "visible");
TweenMax.fromTo($name1, .5, {scale:0},{scale:1, delay: 3.75, ease: Elastic.easeOut})
$clickNo.css("visibility", "visible");
TweenMax.fromTo($clickNo, .5, {scale:0},{scale:1, delay: 3.75, ease: Elastic.easeOut})
clicks++;
document.getElementById("clickNo").innerHTML=clicks;
connector($point2, $name2, $connector1, 0);
//connection 2
connector($point3, $name3, $connector2, 1);
//connection 3
connector($point4, $name4, $connector3, 2);
//connection 4
connector($point5, $name5, $connector4, 3);
//connection 5
connector($point6, $name6, $vertical1, 4);
//connection 6
connector($point7, $name7, $connector8, 5);
//connection 7
connector($point8, $name8, $connector7, 6);
//connection 8
connector($point9, $name9, $connector6, 7);
//connection 9
connector($point10, $name10, $connector5, 8);
//connection10
connector($point11, $name11, $vertical2, 9);
//connection11
connector($point12, $name12, $connector9, 10);
//connection12
connector($point13, $name13, $connector10, 11);
//connection13
connector($point14, $name14, $connector11, 12);
//connection14
connector($point15, $name15, $connector12, 13);
//connection15
connector($point16, $name16, $vertical3, 14);
//connection16
connector($point17, $name17, $connector16, 15);
//connection17
connector($point18, $name18, $connector15, 16);
//connection18
connector($point19, $name19, $connector14, 17);
//connection19
connector($point20, $name20, $connector13, 18);
$finalFlare.css("visibility", "visible");
TweenMax.fromTo($finalFlare, .5, {opacity:0}, {opacity:1, delay: 23.5});

});