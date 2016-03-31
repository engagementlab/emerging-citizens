/**
 * Emerging Citizens
 * Developed by Engagement Lab, 2016
 * ==============
 * Session manager (singleton).
 *
 * @class lib
 * @static
 * @author Johnny Richardson
 *
 * ==========
 */

var _ = require('underscore');

var	_GAME_SESSIONS = {};

var SessionManager = {

	Create: function(id, session) {

		console.log('CREATE_SESSION: ', id);

		_GAME_SESSIONS[id] = session;
	},

	Get: function(id) {

		if(id === undefined)
			throw new Error('Session id undefined!');

		// ID can be from mod but stored w/o that affix
		var sessionId = id.replace('-moderator', '');
		var sesh = _GAME_SESSIONS[sessionId];

		if(sesh === undefined){
			console.warn("Game with id '" + id + "' not found!");
		}

		return sesh;
	},

};

module.exports = SessionManager;