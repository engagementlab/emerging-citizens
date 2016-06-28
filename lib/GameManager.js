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

};

module.exports = GameManager;