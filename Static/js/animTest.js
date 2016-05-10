//hub vars
var $hashtag = $("#hashtag-info");
var $wwdmm = $("#meme-info");
var $wikigeeks =$("#geeks-info");
var $stories = $("#stories-info");
//icontest vars
var $iconTest = $("#player-icon-test");
var $iconClearTest = $("#icon-clear-test");
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
var $tweetClearTest= $("#tweet-pane-clear-test");
var $tweetIcons= $(".tweet-player-icon");
var $tweetGamePane= $("#tweet-game-pane");

//hashtag options vars
var $guessRealPane = $("#guess-real");
var $testTagOptions = $("#hashtag-options-test");
var $optionsClearTest = $("#options-clear-test");
var $hashtagOptions = $(".options-block");
var $hashtagOption1 = $("#options-1-place");
var $hashtagOption2 = $("#options-2-place");
var $hashtagOption3 = $("#options-3-place");
var $hashtagOption4 = $("#options-4-place");
var $hashtagOption5 = $("#options-5-place");
var $hashtagOption6 = $("#options-6-place");
var $hashtagOption7 = $("#options-7-place");
var $hashtagOption8 = $("#options-8-place");

//voting results vars
var $votingResultsTest = $("#voting-results-test");
var $votingResultsReveal = $("#voting-results-reveal");
var $votingResultsClear = $("#voting-results-clear");
var $resultsPane = $("#results-pane");
var $realTweet = $("#real-tweet");
var $wrongVoters= $(".wrong-voter");
var $wrongVoter1 = $("#wrong-voter-1");
var $wrongVoter2 = $("#wrong-voter-2");
var $wrongVoter3 = $("#wrong-voter-3");
var $wrongVoter4 = $("#wrong-voter-4");
var $hashtagAuthor = $("#hashtag-author");
var $correctVoters= $(".correct-voter");
var $correctVoter1 = $("#correct-voter-1");
var $correctVoter2 = $("#correct-voter-2");
var $correctVoter3 = $("#correct-voter-3");
var $correctVoter4 = $("#correct-voter-4");

//winner's circle vars
var $fakeRow= $("#fake-row");
var $winnersHeader= $("#winners-header");
var $winnersTest= $("#winners-circle-test");
var $winnersPane= $("#winners-pane");
var $winner1= $("#winner-1-pane");
var $winner2= $("#winner-2-pane");
var $winner3= $("#winner-3-pane");
//leaderboard vars
var $leaderboardTest= $("#leaderboard-test");
var $leaderboardClearTest= $("#leaderboard-clear-test");
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

$iconClearTest.click(function(){
	IconsOut();
	setTimeout(PaneOut, 500);
});

$tweetTest.click(function(){
	TweetIconsIn();
	setTimeout(TweetPaneIn, 500);
});





setInterval(function() {

	function r(el, deg) {
		el.css({
			transform:'rotateZ('+ deg + 'deg)'
		})
	}
	var d = new Date()
	r($clockHand, 6*d.getSeconds())

}, 1000);





$tweetClearTest.click(function(){
	TweetIconsOut();
	setTimeout(TweetPaneOut, 500);
});

$testTagOptions.click(function(){
	HashtagOptionsIn();
});
$optionsClearTest.click(function(){
	HashtagOptionsOut();
});
$votingResultsTest.click(function(){
	ResultsIn();
	setTimeout(WrongVotersIn, 2000);
	setTimeout(AuthorIn, 6000);
});
$votingResultsReveal.click(function(){
	ResultsReveal();
	$wrongVoters.fadeOut();
	$hashtagAuthor.fadeOut();
	setTimeout(CorrectVotersIn, 2000);
});
$votingResultsClear.click(function(){
	ResultsOut();
});

$winnersTest.click(function(){
	$winnersHeader.fadeIn();
	$fakeRow.css("visibility","visible");
	TweenMax.from($fakeRow, .5, {top:-250} , {top:0, ease:Elastic.easeIn});
	WinnersCircleIn();
	setTimeout(WinnersCircleOut, 5000);
	$winnersHeader.delay(6000).fadeOut();
});
$leaderboardTest.click(function(){
	$leaderHeader.fadeIn();
	$leaderBlocks.css("visibility", "visible");
	LeaderboardIn();
});

$leaderboardClearTest.click(function(){
	LeaderboardOut();
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
function IconsOut(){
	TweenMax.to($icon1, 2, {left:-600, ease:Elastic.easeOut});
	TweenMax.to($icon2, 2, {left:-600, ease:Elastic.easeOut});
	TweenMax.to($icon3, 2, {left:-600, ease:Elastic.easeOut});
	TweenMax.to($icon4, 2, {left:-600, ease:Elastic.easeOut});
	TweenMax.to($icon5, 2, {right:-600, ease:Elastic.easeOut});
	TweenMax.to($icon6, 2, {right:-600, ease:Elastic.easeOut});
	TweenMax.to($icon7, 2, {right:-600, ease:Elastic.easeOut});
	TweenMax.to($icon8, 2,{right:-600, ease:Elastic.easeOut});
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
function PaneOut(){
	
	TweenMax.fromTo($gamePane, 1, {scale:1}, {scale:0, ease:Elastic.easeOut});
	TweenMax.fromTo($roomCode, .35, {scale:1}, {scale:0, ease:Elastic.easeOut});
	TweenMax.fromTo($code, .35, {scale:1}, {scale:0, ease:Elastic.easeOut});

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
function TweetIconsOut(){
	TweenMax.to($tweetIcon1, 2, {left:-600, ease:Elastic.easeOut});
	TweenMax.to($tweetIcon2, 2, {left:-600, ease:Elastic.easeOut});
	TweenMax.to($tweetIcon3, 2, {left:-600, ease:Elastic.easeOut});
	TweenMax.to($tweetIcon4, 2, {left:-600, ease:Elastic.easeOut});
	TweenMax.to($tweetIcon5, 2, {right:-600, ease:Elastic.easeOut});
	TweenMax.to($tweetIcon6, 2, {right:-600, ease:Elastic.easeOut});
	TweenMax.to($tweetIcon7, 2, {right:-600, ease:Elastic.easeOut});
	TweenMax.to($tweetIcon8, 2,{right:-600, ease:Elastic.easeOut});
	return;
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

function TweetPaneOut(){
	TweenMax.fromTo($clockHand, .95, {scale:1}, {scale:0, ease:Power3.easeIn});
	TweenMax.fromTo($clockFace, .95, {scale:1}, {scale:0, ease:Power3.easeIn});
	TweenMax.fromTo($tweetGamePane, 1, {scale:1}, {scale:0, ease:Power4.easeIn});
	return;
}

function HashtagOptionsIn(){
	$guessRealPane.css("visibility", "visible");
	$hashtagOptions.css("visibility", "visible");
	TweenMax.fromTo($guessRealPane, 1.5, {top: -875},{top:0, ease:Elastic.easeOut});
	TweenMax.fromTo($hashtagOption1, 2, {left: -875},{left: 0, ease:Elastic.easeOut, delay:.5});
	TweenMax.fromTo($hashtagOption2, 2, {left: -875},{left: 0, ease:Elastic.easeOut, delay:1});
	TweenMax.fromTo($hashtagOption3, 2, {left: -875},{left: 0, ease:Elastic.easeOut, delay:1.5});
	TweenMax.fromTo($hashtagOption4, 2, {left: -875},{left: 0, ease:Elastic.easeOut, delay:2});
	TweenMax.fromTo($hashtagOption5, 2, {right: -875},{right: 0, ease:Elastic.easeOut, delay: .5});
	TweenMax.fromTo($hashtagOption6, 2, {right: -875},{right: 0, ease:Elastic.easeOut, delay:1});
	TweenMax.fromTo($hashtagOption7, 2, {right: -875},{right: 0, ease:Elastic.easeOut, delay:1.5});
	TweenMax.fromTo($hashtagOption8, 2, {right: -875},{right: 0, ease:Elastic.easeOut, delay:2});
}
function HashtagOptionsOut(){
	TweenMax.fromTo($guessRealPane, 1.5, {top: 0},{top:-500, ease:Elastic.easeOut, delay: 1.5});
	TweenMax.fromTo($hashtagOption1, .5, {left: 0},{left:-900});
	TweenMax.fromTo($hashtagOption2, .5, {left: 0},{left:-900, delay: .5});
	TweenMax.fromTo($hashtagOption3, .5, {left: 0},{left:-900, delay: 1});
	TweenMax.fromTo($hashtagOption4, .5, {left: 0},{left:-900, delay: 1.5});
	TweenMax.fromTo($hashtagOption5, .5, {right: 0},{right:-900});
	TweenMax.fromTo($hashtagOption6, .5, {right: 0},{right:-900, delay: .5});
	TweenMax.fromTo($hashtagOption7, .5, {right: 0},{right:-900, delay: 1});
	TweenMax.fromTo($hashtagOption8, .5, {right: 0},{right:-900, delay: 1.5});
	$guessRealPane.delay(2000).hide(0);
	$hashtagOptions.delay(2000).hide(0);
}

function ResultsIn(){
	$resultsPane.css("visibility", "visible");
	$realTweet.css("visibility", "visible");
	TweenMax.from($resultsPane, 1.5,{top:-300, ease:Elastic.easeOut});
	TweenMax.from($realTweet, 1.5,{top:-600, ease:Elastic.easeOut});
}

function ResultsReveal(){
	TweenMax.to($resultsPane, 1.5,{top:200, ease:Bounce.easeOut});
}

function ResultsOut(){
	TweenMax.to($correctVoters, 3, {top:600, ease:Elastic.easeOut});
	TweenMax.to($resultsPane, 1.5,{top:-600, ease:Elastic.easeOut, delay:1});
	TweenMax.to($realTweet, 1.5,{top:-600, ease:Elastic.easeOut, delay:1});
	$resultsPane.delay(2000).hide(0);
	$realTweet.delay(2000).hide(0);
	$correctVoters.delay(2000).hide(0);
}

function AuthorIn(){
	$hashtagAuthor.css("visibility", "visible");
	TweenMax.fromTo($hashtagAuthor, .5, {scale:6},{scale:1, ease:Bounce.easeOut});
}

function WrongVotersIn(){
	$wrongVoters.css("visibility", "visible");
	TweenMax.fromTo($wrongVoter1, .25, {scale:6},{scale:1, ease:Bounce.easeOut});
	TweenMax.fromTo($wrongVoter2, .5, {scale:6},{scale:1, ease:Bounce.easeOut});
	TweenMax.fromTo($wrongVoter3, .75, {scale:6},{scale:1, ease:Bounce.easeOut});
	TweenMax.fromTo($wrongVoter4, 1, {scale:6},{scale:1, ease:Bounce.easeOut});
}

function CorrectVotersIn(){
	$correctVoters.css("visibility", "visible");
	TweenMax.fromTo($correctVoter1, .25, {scale:6},{scale:1, ease:Bounce.easeOut});
	TweenMax.fromTo($correctVoter2, .5, {scale:6},{scale:1, ease:Bounce.easeOut});
	TweenMax.fromTo($correctVoter3, .75, {scale:6},{scale:1, ease:Bounce.easeOut});
	TweenMax.fromTo($correctVoter4, 1, {scale:6},{scale:1, ease:Bounce.easeOut});
}

function WinnersCircleIn(){
	$winner1.css("visibility", "visible");
	TweenMax.fromTo($winner1, 1, {right:-850} , {right:0, ease:Elastic.easeOut});
	$winner2.css("visibility", "visible");
	TweenMax.fromTo($winner2, 1, {right:-850} , {right:0, ease:Elastic.easeOut, delay:.3});
	$winner3.css("visibility", "visible");
	TweenMax.fromTo($winner3, 1, {right:-500} , {right:0, ease:Elastic.easeOut, delay:.6});
}
function WinnersCircleOut(){
	TweenMax.fromTo($winner1, .75, {left:0} , {left:-1250});
	TweenMax.fromTo($winner2, .75, {left:0} , {left:-1500, delay:.5});
	TweenMax.fromTo($winner3, .75, {left:0} , {left:-1700, delay:1});
}
function LeaderboardIn(){

	TweenMax.fromTo($leader1, 2, {left: -875},{left:-75, ease:Elastic.easeOut});
	TweenMax.fromTo($leader2, 2, {left: -875},{left:-75, ease:Elastic.easeOut, delay:.5});
	TweenMax.fromTo($leader3, 2, {left: -875},{left:-75, ease:Elastic.easeOut, delay: 1});
	TweenMax.fromTo($leader4, 2, {left: -875},{left:-75, ease:Elastic.easeOut, delay: 1.5});
	TweenMax.fromTo($leader5, 2, {right: -875},{right:-75, ease:Elastic.easeOut});
	TweenMax.fromTo($leader6, 2, {right: -875},{right:-75, ease:Elastic.easeOut, delay:.5});
	TweenMax.fromTo($leader7, 2, {right: -875},{right:-75, ease:Elastic.easeOut, delay: 1});
	TweenMax.fromTo($leader8, 2, {right: -875},{right:-75, ease:Elastic.easeOut, delay:1.5});
}

function LeaderboardOut(){
	TweenMax.to($leader1, 2, {left:-875, ease:Elastic.easeOut});
	TweenMax.to($leader2, 2, {left:-875, ease:Elastic.easeOut, delay:.5});
	TweenMax.to($leader3, 2, {left:-875, ease:Elastic.easeOut, delay: 1});
	TweenMax.to($leader4, 2, {left:-875, ease:Elastic.easeOut, delay: 1.5});
	TweenMax.to($leader5, 2, {right:-875, ease:Elastic.easeOut});
	TweenMax.to($leader6, 2, {right:-875, ease:Elastic.easeOut, delay:.5});
	TweenMax.to($leader7, 2, {right:-875, ease:Elastic.easeOut, delay: 1});
	TweenMax.to($leader8, 2, {right:-875, ease:Elastic.easeOut, delay:1.5});
}
