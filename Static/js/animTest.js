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
var $clockFace= $("#clock-face");
var $clockHand= $("#clock-hand");

var $tweetIcon1 = $("#tweet-player-icon1");
var $tweetIcon2 = $("#tweet-player-icon2");
var $tweetIcon3 = $("#tweet-player-icon3");
var $tweetIcon4 = $("#tweet-player-icon4");
var $tweetIcon5 = $("#tweet-player-icon5");
var $tweetIcon6 = $("#tweet-player-icon6");
var $tweetIcon7 = $("#tweet-player-icon7");
var $tweetIcon8 = $("#tweet-player-icon8");
var $tweetTest= $("#tweet-pane-test");
var $tweetIcons= $(".tweet-player-icon");
var $tweetGamePane= $("#tweet-game-pane");

var $fakeRow= $("#fake-row");
var $winnersTest= $("#winners-circle-test");
var $winner1= $("#winner-1");
var $winner2= $("#winner-2");
var $winner3= $("#winner-3");

TweenMax.fromTo($hashtag, .9, {scale:0}, {scale:1, ease:Elastic.easeOut});
TweenMax.fromTo($wwdmm, .7, {scale:0}, {scale:1, ease:Elastic.easeOut})
TweenMax.fromTo($wikigeeks, .8, {scale:0}, {scale:1, ease:Elastic.easeOut});
TweenMax.fromTo($stories, 1, {scale:0}, {scale:1, ease:Elastic.easeOut});

$iconTest.click(function(){
	IconsIn();
	setTimeout(PaneIn, 500);
});

$tweetTest.click(function(){
	TweetIconsIn();
	setTimeout(TweetPaneIn, 500);
});

$winnersTest.click(function(){
	$fakeRow.css("visibility","visible");
	TweenMax.from($fakeRow, 1, {top:-250} , {top:0, ease:Elastic.easeIn});
	WinnersCircle();
});


function IconsIn(){
$icons.css("visibility","visible");
TweenMax.fromTo($icon1, 2, {left: -500},{left:-75, ease:Elastic.easeOut});
TweenMax.fromTo($icon2, 2, {left: -500},{left:-75, ease:Elastic.easeOut, delay:.1});
TweenMax.fromTo($icon3, 2, {left: -500},{left:-75, ease:Elastic.easeOut, delay:.2});
TweenMax.fromTo($icon4, 2, {left: -500},{left:-75, ease:Elastic.easeOut, delay:.3});
TweenMax.fromTo($icon5, 2, {right: -500},{right:-75, ease:Elastic.easeOut});
TweenMax.fromTo($icon6, 2, {right: -500},{right:-75, ease:Elastic.easeOut, delay:.1});
TweenMax.fromTo($icon7, 2, {right: -500},{right:-75, ease:Elastic.easeOut, delay:.2});
TweenMax.fromTo($icon8, 2, {right: -500},{right:-75, ease:Elastic.easeOut, delay:.3});
return;
}
function PaneIn(){
$gamePane.css("visibility", "visible");
TweenMax.fromTo($gamePane, 1, {scale:0}, {scale:1, ease:Elastic.easeOut});
TweenMax.fromTo($roomCode, 1, {scale:0}, {scale:1, ease:Elastic.easeOut});
TweenMax.fromTo($code, 1, {scale:0}, {scale:1, ease:Elastic.easeOut});
$roomCode.css("visibility", "visible");
$code.css("visibility", "visible");
return;
}
function TweetIconsIn(){
$tweetIcons.css("visibility","visible");
TweenMax.fromTo($tweetIcon1, 2, {left: -500},{left:-75, ease:Elastic.easeOut});
TweenMax.fromTo($tweetIcon2, 2, {left: -500},{left:-75, ease:Elastic.easeOut, delay:.1});
TweenMax.fromTo($tweetIcon3, 2, {left: -500},{left:-75, ease:Elastic.easeOut, delay:.2});
TweenMax.fromTo($tweetIcon4, 2, {left: -500},{left:-75, ease:Elastic.easeOut, delay:.3});
TweenMax.fromTo($tweetIcon5, 2, {right: -500},{right:-75, ease:Elastic.easeOut});
TweenMax.fromTo($tweetIcon6, 2, {right: -500},{right:-75, ease:Elastic.easeOut, delay:.1});
TweenMax.fromTo($tweetIcon7, 2, {right: -500},{right:-75, ease:Elastic.easeOut, delay:.2});
TweenMax.fromTo($tweetIcon8, 2, {right: -500},{right:-75, ease:Elastic.easeOut, delay:.3});
}
function TweetPaneIn(){
$tweetGamePane.css("visibility", "visible");
TweenMax.fromTo($tweetGamePane, 1, {scale:0}, {scale:1, ease:Elastic.easeOut});
$clockFace.css("visibility", "visible");
$clockHand.css("visibility", "visible");
TweenMax.fromTo($clockFace, 1, {scale:0}, {scale:1, ease:Elastic.easeOut});
TweenMax.fromTo($clockHand, 1, {scale:0}, {scale:1, ease:Elastic.easeOut});
return;
}

function WinnersCircle(){
	$winner1.css("visibility", "visible");
	TweenMax.from($winner1, .75, {right:-1000} , {right:0, ease:Elastic.easeIn});
	$winner2.css("visibility", "visible");
	TweenMax.from($winner2, .75, {right:-1000} , {right:0, ease:Elastic.easeIn});
	$winner3.css("visibility", "visible");
	TweenMax.from($winner3, .75, {right:-1000} , {right:0, ease:Elastic.easeIn});
}
