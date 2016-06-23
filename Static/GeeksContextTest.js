//Define vars/functions/objects

var $topMenu = $("#menuImage");
var $contextPane = $("#contextPane");


//code body
TweenMax.from($topMenu, .5, {y:-300, ease:Circ.easeOut});
TweenMax.from($contextPane, .5, {rotation: 180, y:500});