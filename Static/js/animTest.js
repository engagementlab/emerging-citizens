var $hashtag = $("#hashtag-info");
var $wwdmm = $("#meme-info");
var $wikigeeks =$("#geeks-info");
var $stories = $("#stories-info");

var $iconTest = $("#player-icon-test");
var $icon1 = $("#player-icon1");
var $icon2 = $("#player-icon2");
var $icon3 = $("#player-icon3");
var $icon4 = $("#player-icon4");
var $icon5 = $("#player-icon5");
var $icon6 = $("#player-icon6");
var $icon7 = $("#player-icon7");
var $icon8 = $("#player-icon8");


TweenMax.fromTo($hashtag, 1, {scale:0}, {scale:1, ease:Elastic.easeOut});
TweenMax.fromTo($wwdmm, .7, {scale:0}, {scale:1, ease:Elastic.easeOut})
TweenMax.fromTo($wikigeeks, .7, {scale:0}, {scale:1, ease:Elastic.easeOut});
TweenMax.fromTo($stories, .7, {scale:0}, {scale:1, ease:Elastic.easeOut});

$iconTest.click(function(){
TweenMax.from($icon1, 2, {left:-200, ease:Elastic.easeOut});
TweenMax.from($icon2, 2, {left:-200, ease:Elastic.easeOut});
TweenMax.from($icon3, 2, {left:-200, ease:Elastic.easeOut});
TweenMax.from($icon4, 2, {left:-200, ease:Elastic.easeOut});
TweenMax.from($icon5, 2, {right:-200, ease:Elastic.easeOut});
TweenMax.from($icon6, 2, {right:-200, ease:Elastic.easeOut});
TweenMax.from($icon7, 2, {right:-200, ease:Elastic.easeOut});
TweenMax.from($icon8, 2, {right:-200, ease:Elastic.easeOut});
});