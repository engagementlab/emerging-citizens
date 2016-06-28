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

var _ = require('underscore');

var GameManager = function(gameSession) {

	console.log (JSON.stringify(gameSession));

	if (gameSession.gameType === "0") {

		var HashtagLib = require('./Hashtag');
		var HashtagGame = new HashtagLib(gameSession);

		HashtagGame.Initialize();

		return HashtagGame;
	}

	if (gameSession.gameType === "1") {

		var WikiLib = require('./Wiki');
		var WikiGame = new WikiLib(gameSession);

		WikiGame.Initialize();

		return WikiGame;
	}

};

module.exports = GameManager;