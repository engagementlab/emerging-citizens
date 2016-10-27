//Define vars/functions/objects

var $addPlayer = $("#addAPlayerButton");
var $losePlayer = $("#loseAPlayerButton");
var $avatarsOut = $("#avatarsOutButton");

var avatars = [ 
$avatar1 = $("#avatarOne"),
$avatar2 = $("#avatarTwo"),
$avatar3 = $("#avatarThree"),
$avatar4 = $("#avatarFour"),
$avatar5 = $("#avatarFive"),
$avatar6 = $("#avatarSix"),
$avatar7 = $("#avatarSeven"),
$avatar8 = $("#avatarEight"),
]

$lobbyPane = $("#lobbyPane");

var playerNo = -1; 

function Player(number, active, avatar){
	this.number=number, this.active=active, this.avatar=avatar}

function TurnOn(Player){
	TweenMax.to(Player.avatar, 1, {css:{opacity:"1.0"}});
	TweenMax.to(Player.avatar, 1, {scale:1.1, ease:Elastic.easeOut});
}

function TurnOff(Player){
	TweenMax.to(Player.avatar, 1, {css:{opacity:"0.4"}});
	TweenMax.to(Player.avatar, 1, {scale:.95, ease:Elastic.easeOut});
}

var players = [8];


//Main Code
TweenMax.from($lobbyPane, 1, {scale:0, ease:Elastic.easeOut});
TweenMax.from($(".playerLeftEven"), 1.75, {x:-800, ease:Elastic.easeOut, delay: 1.5});
TweenMax.from($(".playerRightEven"), 2.25, {x:800, ease:Elastic.easeOut, delay: 1.5});
TweenMax.from($(".playerLeftOdd"), 1.25, {x:-800, ease:Elastic.easeOut, delay: 1.5});
TweenMax.from($(".playerRightOdd"), 2.75, {x:800, ease:Elastic.easeOut, delay: 1.5});



$addPlayer.click(function(){
	playerNo++;
	players[playerNo] = new Player(playerNo, true, avatars[playerNo], [this]);
	TurnOn(players[playerNo]);
	console.log(players[playerNo]);
});

$losePlayer.click(function(){
	TurnOff(players[playerNo]);
	playerNo--;
	console.log(players[playerNo]);
});

$avatarsOut.click(function(){
	TweenMax.to($lobbyPane, .75, {scale:0, ease:Expo.easeIn});
	TweenMax.to($(".playerLeftEven"), 1.75, {x:1200, opacity:0.0, ease:Elastic.easeIn});
	TweenMax.to($(".playerRightEven"), 1.25, {x:-1200, opacity:0.0, ease:Elastic.easeIn});
	TweenMax.to($(".playerLeftOdd"), 1.25, {x:1200, opacity:0.0, ease:Elastic.easeIn});
	TweenMax.to($(".playerRightOdd"), 1.75, {x:-1200, opacity:0.0, ease:Elastic.easeIn});
});

$("#lobbyLink").click(function (e) {
    e.preventDefault();                   // prevent default anchor behavior
    var goTo = this.getAttribute("href"); // store anchor href

    // do something while timeOut ticks ... 

    setTimeout(function(){
         window.location = goTo;
    },3000);       
}); 

