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

	let HashtagLib = require('./games/HTYI');

	let Game = new HashtagLib();
	Game.Initialize(gameSession);

	return Game;

		HashtagGame.Initialize();

		return HashtagGame;
	

	if (gameSession.gameType === "1") {

		var WikiLib = require('./Wiki');
		var WikiGame = new WikiLib(gameSession);

		WikiGame.Initialize();

		return WikiGame;
	}

};

module.exports = GameManager; 