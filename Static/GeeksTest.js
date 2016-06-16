//Define vars/functions/objects

var $addPlayer = $("#addAPlayerButton");

var $avatar1 = $("#avatarOne");
var $avatar2 = $("#avatarTwo");
var $avatar3 = $("#avatarThree");
var $avatar4 = $("#avatarFour");
var $avatar5 = $("#avatarFive");
var $avatar6 = $("#avatarSix");
var $avatar7 = $("#avatarSeven");
var $avatar8 = $("#avatarEight");
var $avatars = $(".avatar");
var playerNo = -1; 

function Player(number, active, avatar){
	this.number=number, this.active=active, this.avatar=avatar}

function TurnOn(Player){
	TweenMax.to(Player.avatar, 1, {css:{opacity:"1.0"}});
}

var players = [8];


//Main Code

$addPlayer.click(function(){
	playerNo++;
	players[playerNo] = new Player(playerNo, true, ("$avatar" + (playerNo+1)), [this]);
});

