//declare vars
var startGame = $(".startGame");
var gunControl = $(".gunControl");
var voteCategory = $(".voteCategory");
var voteInstructions = $(".voteInstructions");
var yellowUnderscore = $(".yellowUnderscore");
var greenUnderscore = $(".greenUnderscore");
var meme1 = $(".meme1");
var meme2 = $(".meme2");
var meme3 = $(".meme3");
var meme4 = $(".meme4");
var meme5 = $(".meme5");
var meme6 = $(".meme6");
var meme7 = $(".meme7");
var meme8 = $(".meme8");

//main code

TweenMax.to(gunControl, 1, {opacity:1.0, delay:0.5});
TweenMax.to(voteCategory, 1, {opacity:1.0, delay:1});

TweenMax.from(meme1, 1.5, {x:-1200, ease:Elastic.easeOut, delay:3});
TweenMax.from(meme2, 1.5, {x:-1200, ease:Elastic.easeOut, delay:2.5});
TweenMax.from(meme3, 1.5, {x:-1600, ease:Elastic.easeOut, delay:2});
TweenMax.from(meme4, 1.5, {x:-1800, ease:Elastic.easeOut, delay:1.5});
TweenMax.from(meme5, 1.5, {x:-1200, ease:Elastic.easeOut, delay:2.9});
TweenMax.from(meme6, 1.5, {x:-1200, ease:Elastic.easeOut, delay:2.4});
TweenMax.from(meme7, 1.5, {x:-1600, ease:Elastic.easeOut, delay:1.9});
TweenMax.from(meme8, 1.5, {x:-1800, ease:Elastic.easeOut, delay:1.4});


startGame.click(function(){
	TweenMax.to(voteInstructions, 1, {opacity:0.0, delay:0.5});
	TweenMax.to(yellowUnderscore, 1, {opacity:0.0, delay:0.5});
	TweenMax.to(greenUnderscore, 1, {opacity:0.0, delay:0.5});

TweenMax.to(meme1, 1.5, {x:1600, ease:Elastic.easeOut, delay:2});
TweenMax.to(meme1, 0.25, {opacity: 0.0, delay:2});
TweenMax.to(meme2, 1.5, {x:1200, ease:Elastic.easeOut, delay:1.5});
TweenMax.to(meme2, 0.25, {opacity: 0.0, delay:1.5});
TweenMax.to(meme3, 1.5, {x:900, ease:Elastic.easeOut, delay:1});
TweenMax.to(meme3, 0.5, {opacity: 0.0, delay:1});
TweenMax.to(meme4, 1.5, {x:600, ease:Elastic.easeOut, delay:0.5});
TweenMax.to(meme4, 0.5, {opacity: 0.0, delay:0.5});
TweenMax.to(meme5, 1.5, {x:1600, ease:Elastic.easeOut, delay:1.9});
TweenMax.to(meme5, 0.25, {opacity: 0.0, delay:1.9});
TweenMax.to(meme6, 1.5, {x:1200, ease:Elastic.easeOut, delay:1.4});
TweenMax.to(meme6, 0.25, {opacity: 0.0, delay:1.4});
TweenMax.to(meme7, 1.5, {x:900, ease:Elastic.easeOut, delay:0.9});
TweenMax.to(meme7, 0.5, {opacity: 0.0, delay:0.9});
TweenMax.to(meme8, 1.5, {x:600, ease:Elastic.easeOut, delay:0.4});
TweenMax.to(meme8, 0.5, {opacity: 0.0, delay:0.4});
});

$("#lobbyLink").click(function (e) {
    e.preventDefault();                   // prevent default anchor behavior
    var goTo = this.getAttribute("href"); // store anchor href

    // do something while timeOut ticks ... 

    setTimeout(function(){
         window.location = goTo;
    },3000);       
}); 