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

module.exports = function(gameSession) {

    var _SESSION_CONFIG = gameSession;
    var _PLAYERS = [];

    this.PlayerReady = function(player) {

        _PLAYERS.push(player);

    }
    
};