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

	if (gameSession.gameType === "0") {
	
		let HashtagLib = require('./games/HTYI');
		Game = new HashtagLib();
	
	}
	
	else if (gameSession.gameType === "1") {
	
		let WikiLib = require('./games/Wiki');
		Game = new WikiLib();
	
	}

	Game.Initialize(gameSession);

	return Game;

};

module.exports = GameManager;