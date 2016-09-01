// declare vars
var addAPlayer = $(".addPlayer");
var losePlayer = $(".losePlayer");
var startGame = $(".startGame");
var topBar = $(".topBar");
var memeAbout = $(".memeAbout");
var memeTopic = $(".memeTopic");
var topicUnderscore = $(".topicUnderscore");
var playersA = $(".playersA");
var playersB = $(".playersB");
var centerBlock = $(".centerBlock");
var memeImage = $(".memeImage");
var memeText = $(".gunControl");
var timer = $(".timer");
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
];
var names = [
$name1 = $(".player1Name"),
$name2 = $(".player2Name"),
$name3 = $(".player3Name"),
$name4 = $(".player4Name"),
$name5 = $(".player5Name"),
$name6 = $(".player6Name"),
$name7 = $(".player7Name"),
$name8 = $(".player8Name"),
];
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
	TweenMax.to(Player.avatar, 1, {scale:0.95, ease:Elastic.easeOut});
	TweenMax.to(Player.name, 1, {css:{opacity:"0.4"}});
	TweenMax.to(Player.name, 1, {scale:0.95, ease:Elastic.easeOut});
}


//main code
TweenMax.to(memeTopic, 1, {opacity:1.0, delay: 3.5});
TweenMax.to(topicUnderscore, 1, {opacity:1.0, delay: 3.5});
TweenMax.to(memeAbout, 1, {opacity:1.0, delay: 0.5});
TweenMax.from(centerBlock, 1.5, {y: -850, ease: Elastic.easeOut, delay: 0.5});
TweenMax.fromTo(memeImage, 1, {opacity:0}, {opacity:1.0, delay: 3});
TweenMax.fromTo(memeText, 1, {opacity:0}, {opacity:1.0, delay: 3.5});
TweenMax.from(playersA, 1.5, {x: -600, ease: Elastic.easeOut, delay: 2});
TweenMax.from(playersB, 1.5, {x: 600, ease: Elastic.easeOut, delay: 2});

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
	 TweenMax.to(playersA, 1.5, {y:800, ease: Elastic.easeOut,  delay: 0.5});
	 TweenMax.to(playersB, 1.5, {y:800, ease: Elastic.easeOut, delay: 1.5});
	 TweenMax.to(centerBlock, 1.5, {y: 900, ease: Elastic.easeOut, delay: 1});
	 TweenMax.to(memeAbout, 1, {opacity: 0, delay: 0.5});
	 TweenMax.to(topicUnderscore, 1, {opacity: 0, delay: 0.5});
});

$("#lobbyLink").click(function (e) {
    e.preventDefault();                   // prevent default anchor behavior
    var goTo = this.getAttribute("href"); // store anchor href

    // do something while timeOut ticks ... 

    setTimeout(function(){
         window.location = goTo;
    },3000);       
}); 

