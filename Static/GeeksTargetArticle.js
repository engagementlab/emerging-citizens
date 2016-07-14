//Define vars/functions/objects

var $topMenu = $("#menuImage");
var $targetPane = $("#targetPane");
var $header = $("#header");
var $articleTitle = $("#articleTitle");
var $articleInfo = $("#articleInfo");
var $indianSoldiers = $("#indianSoldiers");
var $pinkBox = $("#pinkBox");

var $playerRow = $("#playerRow");
var $addAPlayer = $("#addAPlayer");

var avatars = [ 
$avatar1 = $("#player1"),
$avatar2 = $("#player2"),
$avatar3 = $("#player3"),
$avatar4 = $("#player4"),
$avatar5 = $("#player5"),
$avatar6 = $("#player6"),
$avatar7 = $("#player7"),
$avatar8 = $("#player8"),
]

var playerNo = -1;

function Player(number, active, avatar){
	this.number=number, this.active=active, this.avatar=avatar}

function TurnOn(Player){
	TweenMax.to(Player.avatar, 1, {scale:1.1, ease:Elastic.easeOut});
	TweenMax.to(Player.avatar, 1, {css:{opacity:"1.0"}});
}
var players = [8];

//code body
$addAPlayer.click(function(){
	playerNo++;
	players[playerNo] = new Player(playerNo, true, avatars[playerNo], [this]);
	TurnOn(players[playerNo]);
});


TweenMax.to($targetPane, .75, {width:950});

$header.css("visibility","visible");
TweenMax.fromTo($header, .5, {opacity:0.0}, {opacity:1.0, delay: 1});

$articleTitle.css("visibility","visible");
TweenMax.fromTo($articleTitle, .5, {opacity:0.0}, {opacity:1.0, delay: 1.5});

$pinkBox.css("visibility", "visible");
TweenMax.fromTo($pinkBox, .5, {opacity:0.0}, {opacity:1.0, delay: 1.75})

$playerRow.css("visibility", "visible");
TweenMax.fromTo($playerRow, 1, {css:{opacity:"0.0"}}, {css:{opacity:"0.5"}, delay: 1.75})

$articleInfo.css("visibility","visible");
TweenMax.fromTo($articleInfo, .5, {opacity:0.0}, {opacity:1.0, delay: 2});

$indianSoldiers.css("visibility","visible");
TweenMax.fromTo($indianSoldiers, .5, {opacity:0.0}, {opacity:1.0, delay: 2.25});

