var $hashtag = $("#hashtag-info");
var $wwdmm = $("#meme-info");
var $wikigeeks =$("#geeks-info");
var $stories = $("#stories-info");
var $icon = $("#player-icon");


TweenMax.fromTo($hashtag, 1, {scale:0}, {scale:1, ease:Elastic.easeOut});
TweenMax.fromTo($wwdmm, .7, {scale:0}, {scale:1, ease:Elastic.easeOut})
TweenMax.fromTo($wikigeeks, .7, {scale:0}, {scale:1, ease:Elastic.easeOut});
TweenMax.fromTo($stories, .7, {scale:0}, {scale:1, ease:Elastic.easeOut});


$icon.onclick()
{
	TweenMax.fromTo($icon, 1, {scale:0}, {scale:1, ease:Elastic.easeOut});
}