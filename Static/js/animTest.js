var $hashtag = $("#hashtag-info");
var $wwdmm = $("#meme-info");
var $wikigeeks =$("#geeks-info");
var $stories = $("#stories-info");

var $iconTest = $("#player-icon-test");
var $icons = $(".player-icon")
var $icon1 = $("#player-icon1");
var $icon2 = $("#player-icon2");
var $icon3 = $("#player-icon3");
var $icon4 = $("#player-icon4");
var $icon5 = $("#player-icon5");
var $icon6 = $("#player-icon6");
var $icon7 = $("#player-icon7");
var $icon8 = $("#player-icon8");
var $gamePane= $("#pane");
var $roomCode= $("#room-code");
var $code= $("#code");


TweenMax.fromTo($hashtag, .9, {scale:0}, {scale:1, ease:Elastic.easeOut});
TweenMax.fromTo($wwdmm, .7, {scale:0}, {scale:1, ease:Elastic.easeOut})
TweenMax.fromTo($wikigeeks, .8, {scale:0}, {scale:1, ease:Elastic.easeOut});
TweenMax.fromTo($stories, 1, {scale:0}, {scale:1, ease:Elastic.easeOut});

$iconTest.click(function(){
	IconsIn();
	setTimeout(PaneIn, 500);
});


function IconsIn(){
$icons.css("visibility","visible");
TweenMax.fromTo($icon1, 2, {left: -500},{left:-200, ease:Elastic.easeOut});
TweenMax.fromTo($icon2, 2, {left: -500},{left:-200, ease:Elastic.easeOut, delay:.1});
TweenMax.fromTo($icon3, 2, {left: -500},{left:-200, ease:Elastic.easeOut, delay:.2});
TweenMax.fromTo($icon4, 2, {left: -500},{left:-200, ease:Elastic.easeOut, delay:.3});
TweenMax.fromTo($icon5, 2, {right: -500},{right:-200, ease:Elastic.easeOut});
TweenMax.fromTo($icon6, 2, {right: -500},{right:-200, ease:Elastic.easeOut, delay:.1});
TweenMax.fromTo($icon7, 2, {right: -500},{right:-200, ease:Elastic.easeOut, delay:.2});
TweenMax.fromTo($icon8, 2, {right: -500},{right:-200, ease:Elastic.easeOut, delay:.3});
return;
}

function PaneIn(){
$gamePane.css("visibility", "visible");
TweenMax.fromTo($gamePane, 1, {scale:0}, {scale:1, ease:Elastic.easeOut});
$roomCode.css("visibility", "visible");
$code.css("visibility", "visible");
return;
}