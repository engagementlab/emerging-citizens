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

var redis = require("redis").createClient(),
  _ = require('underscore');

redis.on("error", function (err) {
	throw err;
});

var GameManager = function(gameSession) {

	var HashtagGame = require('./Hashtag');

	return new HashtagGame(gameSession);

};

module.exports = GameManager;