/**
 * Emerging Citizens
 * Developed by Engagement Lab, 2015
 * ==============
 * Home page view controller.
 *
 * Help: http://keystonejs.com/docs/getting-started/#routesviews-firstview
 *
 * @class index
 * @static
 * @author Johnny Richardson
 *
 * ==========
 */

var keystone = require('keystone'),
    async = require('async'),
    appRoot = require('app-root-path'),
    _ = require('underscore');
    
var HashtagGame = keystone.list('HashtagGame'),
    Game = require(appRoot + '/lib/GameManager'),
    Session = require(appRoot + '/lib/SessionManager');

/**
 * Create a GameSession
 */
exports.create = function(req, res) {

    var sessionType;
    var data = (req.method == 'POST') ? req.body : req.query;
    
    if(data.gameType === "0")
        sessionType = new HashtagGame.model();

    sessionType.getUpdateHandler(req).process(data, function(err) {
        
        if (err) return res.apiError('error', err);

        // Save this session to memory for faster retrieval (deleted when game ends)
        Session.Create(data.accessCode, new Game(sessionType));

        res.send('/moderator/monitor/' + data.accessCode);
        
    });

};
