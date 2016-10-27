'use strict';

/**
 * Emerging Citizens
 * Developed by Engagement Lab, 2016
 * ==============
 * Game manager.
 *
 * @class lib
 * @static
 * @author Johnny Richardson
 *
 * ==========
 */

var GameManager = function(gameSession) {
	
	let Game;

	if (gameSession.gameType === "htyi") {
	
		let HashtagLib = require('./games/HTYI');
		Game = new HashtagLib();
	
	}
	
	else if (gameSession.gameType === "wikigeeks") {
	
		let WikiLib = require('./games/Wiki');
		Game = new WikiLib();
	
	}
	
	else if (gameSession.gameType === "wwdmm") {
	
		let MemeLib = require('./games/Meme');
		Game = new MemeLib();
	
	}

	Game.Initialize(gameSession);

	return Game;

};

module.exports = GameManager;