// Any custom app initialization logic should go here
appStart = function(app) {
	
	var keystone = require('keystone');
	var appServer = keystone.get('appServer');
	var rootDir = require('app-root-path');
	var io = require(rootDir + '/lib/sockets')(appServer)

	keystone.set('sockets', io)

};

module.exports = function() { return { 
		keystone: require('keystone'),
		start: appStart	
}}();