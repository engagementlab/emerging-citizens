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

var logger = require('winston'),
    colors = require('colors');

var	_GAME_SESSIONS = {};

var SessionManager = {

	Create: function(id, session) {

		logger.log('CREATE_SESSION: '.green, id);

		_GAME_SESSIONS[id] = session;
	},

	Delete: function(id) {

		if(id === undefined)
			logger.warn('Session id undefined!'.red);

		var sesh = _GAME_SESSIONS[id];

		if(sesh === undefined){
			logger.warn("SessionManager.Delete", "Game with id '".red + id + "' not found!".red);
		}

		logger.log('DELETE_SESSION: ', id);

		delete _GAME_SESSIONS[id];
	},

	Get: function(id) {

		if(id === undefined || id === null) {
			logger.warn('Session id undefined!'.red);
			return;
		}

		// ID can be from group but stored w/o that affix
		var sessionId = id.replace('-group', '');
		var sesh = _GAME_SESSIONS[sessionId];

		if(sesh === undefined){
			logger.warn("SessionManager.Get", "Game with id '".red + id + "' not found!".red);
		}

		return sesh;
	},

	Save: function(sessionData) {

	  sessionData.save(function(err) {
	      
	      if (err) throw new Error('error', err);
	      
	  });


	},

	GroupView: function(id, groupId) {

		if(groupId === undefined)
			logger.warn('Moderator id undefined!'.red);
		else if(id === undefined)
			logger.warn('Session id undefined!'.red);

		// ID can be from mod but stored w/o that affix
		var sessionId = id.replace('-group', '');
		var sesh = _GAME_SESSIONS[sessionId];

		sesh.groupModerator = groupId;

		logger.log("Game Session '" + sessionId + "' group moderator is ", groupId); 

	}

};

module.exports = SessionManager;