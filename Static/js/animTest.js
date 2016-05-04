//hub vars
var $hashtag = $("#hashtag-info");
var $wwdmm = $("#meme-info");
var $wikigeeks =$("#geeks-info");
var $stories = $("#stories-info");
//icontest vars
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
//tweet-pane-test vars
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
//winner's circle vars
var $fakeRow= $("#fake-row");
var $winnersHeader= $("#winners-header");
var $leaderboardTest= $("#leaderboard-test");
var $winnersTest= $("#winners-circle-test");
var $winnersPane= $("#winners-pane");
var $winner1= $("#winner-1-pane");
var $winner2= $("#winner-2-pane");
var $winner3= $("#winner-3-pane");
//leaderboard vars
var $leaderBlocks = $(".leaderboard-block");
var $leaderHeader = $("#leaderboard-header");
var $leader1 = $("#leaderboard-1-place");
var $leader2 = $("#leaderboard-2-place");
var $leader3 = $("#leaderboard-3-place");
var $leader4 = $("#leaderboard-4-place");
var $leader5 = $("#leaderboard-5-place");
var $leader6 = $("#leaderboard-6-place");
var $leader7 = $("#leaderboard-7-place");
var $leader8 = $("#leaderboard-8-place");

//main function call 

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
	$winnersHeader.fadeIn();
	$fakeRow.css("visibility","visible");
	TweenMax.from($fakeRow, .5, {top:-250} , {top:0, ease:Elastic.easeIn});
	WinnersCircleIn();
	setTimeout(WinnersCircleOut, 5000);
	
});
$leaderboardTest.click(function(){
	$leaderHeader.fadeIn();
	$leaderBlocks.css("visibility", "visible");
	LeaderboardIn();
});



//define Functions 

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

function WinnersCircleIn(){
	$winner1.css("visibility", "visible");
	TweenMax.fromTo($winner1, 2, {right:-1000} , {right:0, ease:Elastic.easeOut});
	$winner2.css("visibility", "visible");
	TweenMax.fromTo($winner2, 2, {right:-1000} , {right:0, ease:Elastic.easeOut, delay:.3});
	$winner3.css("visibility", "visible");
	TweenMax.fromTo($winner3, 2, {right:-1000} , {right:0, ease:Elastic.easeOut, delay:.6});
}
function WinnersCircleOut(){
	TweenMax.fromTo($winner1, .75, {left:0} , {left:-1250});
	TweenMax.fromTo($winner2, .75, {left:0} , {left:-1500, delay:.5});
	TweenMax.fromTo($winner3, .75, {left:0} , {left:-1700, delay:1});
}
function LeaderboardIn(){

	TweenMax.fromTo($leader1, 2, {left: -500},{left:-75, ease:Elastic.easeOut});
	TweenMax.fromTo($leader2, 2, {left: -500},{left:-75, ease:Elastic.easeOut, delay:.1});
	TweenMax.fromTo($leader3, 2, {left: -500},{left:-75, ease:Elastic.easeOut, delay:.2});
	TweenMax.fromTo($leader4, 2, {left: -500},{left:-75, ease:Elastic.easeOut, delay:.3});
	TweenMax.fromTo($leader5, 2, {right: -500},{right:-75, ease:Elastic.easeOut});
	TweenMax.fromTo($leader6, 2, {right: -500},{right:-75, ease:Elastic.easeOut, delay:.1});
	TweenMax.fromTo($leader7, 2, {right: -500},{right:-75, ease:Elastic.easeOut, delay:.2});
	TweenMax.fromTo($leader8, 2, {right: -500},{right:-75, ease:Elastic.easeOut, delay:.3});
}