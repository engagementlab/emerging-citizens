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

var keystone = require('keystone');
var _ = require('underscore');
var GameSession = require('../../../models/GameSession');

exports = module.exports = function(req, res) {

    var view = new keystone.View(req, res);

    console.log(req.body)

    var session = new GameSession(req.body);

    session.save(function (err) {
        if (err) 
            throw err;

        res.send('/moderator/monitor');

    });


};
