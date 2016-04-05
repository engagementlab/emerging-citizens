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

	Delete: function(id) {

		if(id === undefined)
			throw new Error('Session id undefined!');

		var sesh = _GAME_SESSIONS[id];

		if(sesh === undefined){
			console.warn("Game with id '" + id + "' not found!");
		}

		console.log('DELETE_SESSION: ', id);

		delete _GAME_SESSIONS[id];
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

	Moderate: function(id, moderator_id) {

		if(moderator_id === undefined)
			throw new Error('Moderator id undefined!'); 
		else if(id === undefined)
			throw new Error('Session id undefined!');

		// ID can be from mod but stored w/o that affix
		var sessionId = id.replace('-moderator', '');
		var sesh = _GAME_SESSIONS[sessionId];

		sesh.moderator = moderator_id;

		console.log("Game Session '" + sessionId + "' moderator is ", moderator_id); 

	}

};

module.exports = SessionManager;