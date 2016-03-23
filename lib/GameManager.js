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

	var HashtagGame = require('./Hashtag');

	return new HashtagGame(gameSession);

};

module.exports = GameManager;