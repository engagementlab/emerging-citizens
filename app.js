// Return server object
serverStart = function() {

	var express = require('express');
	var app = express();
	// var server = express.http();

	// server.io();

	var bodyParser = require('body-parser');
	app.use(bodyParser.json()); // support json encoded bodies
	app.use(bodyParser.urlencoded({ extended: true }));

	return app;

};

// Any custom app initialization logic should go here
appStart = function(app) {
	
	var keystone = require('keystone');
	var appServer = keystone.get('appServer');
	var rootDir = require('app-root-path');
	var io = require(rootDir + '/sockets/')(appServer)

	_GAME_SESSIONS = {};
	CREATE_SESSION = function(id, session) {

		console.log('CREATE_SESSION: ', id)

		_GAME_SESSIONS[id] = session;
	};

	GET_SESSION = function(id) {

		var sesh = _GAME_SESSIONS[id];

		if(sesh === undefined){
			console.warn("Game with id '" + id + "' not found!");
		}

		return sesh;
	};

	// keystone.set('sockets', io)

};

module.exports = function() { return { 
		keystone: require('keystone'),
		server: serverStart,
		start: appStart	

}}();