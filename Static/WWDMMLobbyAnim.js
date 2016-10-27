// declare vars
var addAPlayer = $(".addPlayer");
var losePlayer = $(".losePlayer");
var startGame = $(".startGame");
var topBar = $(".topBar");
var playersA = $(".playersA");
var playersB = $(".playersB");
var centerBlock = $(".centerBlock")
var playerNo = -1;
var avatars = [
$avatar1 = $(".player1Img"),
$avatar2 = $(".player2Img"),
$avatar3 = $(".player3Img"),
$avatar4 = $(".player4Img"),
$avatar5 = $(".player5Img"),
$avatar6 = $(".player6Img"),
$avatar7 = $(".player7Img"),
$avatar8 = $(".player8Img"),
]
var names = [
$name1 = $(".player1Name"),
$name2 = $(".player2Name"),
$name3 = $(".player3Name"),
$name4 = $(".player4Name"),
$name5 = $(".player5Name"),
$name6 = $(".player6Name"),
$name7 = $(".player7Name"),
$name8 = $(".player8Name"),
]
var players = [8];

function Player(number, active, name, avatar){
	this.number=number, this.active=active, this.name=name, this.avatar=avatar}

function TurnOn(Player){
	TweenMax.to(Player.avatar, 1, {css:{opacity:"1.0"}});
	TweenMax.to(Player.avatar, 1, {scale:1.1, ease:Elastic.easeOut});
	TweenMax.to(Player.name, 1, {css:{opacity:"1.0"}});
	TweenMax.to(Player.name, 1, {scale:1.1, ease:Elastic.easeOut});
}

function TurnOff(Player){
	TweenMax.to(Player.avatar, 1, {css:{opacity:"0.4"}});
	TweenMax.to(Player.avatar, 1, {scale:.95, ease:Elastic.easeOut});
	TweenMax.to(Player.name, 1, {css:{opacity:"0.4"}});
	TweenMax.to(Player.name, 1, {scale:.95, ease:Elastic.easeOut});
}
//main code
TweenMax.fromTo(topBar, 1, {y:-300}, { y:-100, ease: Elastic.easeOut, delay: 0.5});
TweenMax.from(centerBlock, 1, {y:-1000, ease: Elastic.easeOut, delay: 1});
TweenMax.from(playersA, 1.25, {x: 600, ease: Elastic.easeOut, delay: 1.25});
TweenMax.fromTo(playersA, .1, {opacity:0.0}, {opacity:1.0, delay: 1.25});
TweenMax.from(playersB, 1.25, {x: -600, ease: Elastic.easeOut, delay: 1.25});
TweenMax.fromTo(playersB, .1, {opacity:0.0}, {opacity:1.0, delay: 1.25});

addAPlayer.click(function(){
	playerNo++;
	players[playerNo] = new Player(playerNo, true, names[playerNo], avatars[playerNo], [this]);
	TurnOn(players[playerNo]);
	console.log(players[playerNo]);
});

losePlayer.click(function(){
	TurnOff(players[playerNo]);
	playerNo--;
	console.log(players[playerNo]);
});

startGame.click(function(){
	 TweenMax.to(playersA, 1, {x:-650, ease: Elastic.easeOut, delay: 2});
	 TweenMax.to(playersB, 1, {x:650, ease: Elastic.easeOut, delay: 2});
	 TweenMax.to(centerBlock, 1, {y: -900, ease: Elastic.easeIn, delay: 1});
});

$("#lobbyLink").click(function (e) {
    e.preventDefault();                   // prevent default anchor behavior
    var goTo = this.getAttribute("href"); // store anchor href

    // do something while timeOut ticks ... 

    setTimeout(function(){
         window.location = goTo;
    },3000);       
}); 