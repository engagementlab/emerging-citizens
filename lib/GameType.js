/**
 * Emerging Citizens
 * Developed by Engagement Lab, 2016
 * ==============
 * Game type core methods
 *
 * @class Gametype
 * @static
 * @author Johnny Richardson
 *
 * ==========
 */
var keystone = require('keystone');
var _ = require('underscore');

module.exports = function(gameSession) {

    var _SESSION_CONFIG = gameSession;
    var _PLAYERS = [];

    this.Events = function(EventEmitter) {
      
        EventEmitter.on('playerReady', function() {


        });

    };

    this.PlayerReady = function(player) {

        _PLAYERS.push(player);

        if(_PLAYERS.count === _SESSION_CONFIG.playerCap-1) {

          require('Tweet')(function(data) {

            TemplateLoader('index/tweet', data, function(html) {
              nameSpace.to('lobby').emit('game:start', html);
            });
          
          });

        }

    }
    
};