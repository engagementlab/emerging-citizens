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

const _ = require('underscore');
const util = require('util');

var GameManager = function(gameSession) {

	var CommonLib = require('./games/Common');
	var HashtagLib = require('./games/HTYI');

	util.inherits(HashtagLib, CommonLib);

	var Game = new HashtagLib(gameSession);
	Game.Initialize();

	return Game;

};

module.exports = GameManager;