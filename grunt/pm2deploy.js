	/**
	* Task to deploy to production or staging
	* 
	* ### Examples:
	*
	*    // Deploys to production pm2 config
	*    grunt deploy --target=production
	*
	*
	* @class Grunt
	* @name grunt/deploy
	*/

  //tasks['pm2deploy:'+target] = 'pm2deploy:' + target +' --ecosystemFile=deploy/' + sitesArg +'.json';

module.exports = function(grunt, options) {

  "use strict";

  var sitesArg = grunt.option('sites');

  var core = {
    
    options: {
        ecosystemFile:  __dirname + '/../node_modules/' + sitesArg + '/deploy.json'
    }

  };

  return core;

};
