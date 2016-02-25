// Any custom app initialization logic should go here
appStart = function(app) {
	
};

module.exports = function() { return { 
		keystone: require('keystone'),
		start: appStart	
}}();