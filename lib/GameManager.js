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

	var HashtagLib = require('./Hashtag');
	var HashtagGame = new HashtagLib(gameSession);

	HashtagGame.Initialize();

	return HashtagGame;

};

module.exports = GameManager;