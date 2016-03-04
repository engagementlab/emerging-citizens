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
		redis = require("redis").createClient(),
    _ = require('underscore'),
    appRoot = require('app-root-path');

var GameSession = require(appRoot + '/models/GameSession');
var GameManager = require(appRoot + '/lib/GameManager');

exports = module.exports = function(req, res) {

    var view = new keystone.View(req, res);

    var session = new GameSession(req.body);

    session.save(function (err) {

        if (err) 
            throw err;

		redis.on("error", function (err) {
		 throw err;
		});

		// Save this session to memory for faster retrieval (deleted when game ends)
		CREATE_SESSION(session.accessCode, new GameManager(session));

        res.send('/moderator/monitor/' + session.accessCode);

    });


};
