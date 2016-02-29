// Return server object
serverStart = function() {

	// var express = require('express')();
	// var server = express.http();

	// server.io();

	return require('express')();

};

// Any custom app initialization logic should go here
appStart = function(app) {
	
	var keystone = require('keystone');
	var appServer = keystone.get('appServer');
	var rootDir = require('app-root-path');
	var io = require(rootDir + '/sockets/')(appServer)

	// keystone.set('sockets', io)

};

module.exports = function() { return { 
		keystone: require('keystone'),
		server: serverStart,
		start: appStart	

}}();