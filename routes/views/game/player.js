/**
 * Emerging Citizens
 * Developed by Engagement Lab, 2015
 * ==============
 * Game player view controller.
 *
 * Help: http://keystonejs.com/docs/getting-started/#routesviews-firstview
 *
 * @class game
 * @static
 * @author Johnny Richardson
 *
 * ==========
 */
var keystone = require('keystone'),
    _ = require('underscore'),
    appRoot = require('app-root-path'),
    GameSession = keystone.list('GameSession'),
    Session = require(appRoot + '/lib/SessionManager');
    Templates = require(appRoot + '/lib/TemplateLoader');

exports = module.exports = function(req, res) {

    var locals = res.locals;
    var template;
    var accessCode = req.params.accesscode.toUpperCase();

    locals.game_not_found = false;

    // locals.section is used to set the currently selected
    // item in the header navigation.
    locals.section = 'player';

    if(Session.Get(accessCode) !== undefined && Session.Get(accessCode).IsFull()) {
       res.send({error_code: 'session_full', msg: 'Sorry! This game is full!'});
       return;
    }

    GameSession.model.findOne({ accessCode: accessCode }, function (err, game) {

        if(game === null || game === undefined) {
            locals.game_not_found = true;
            res.send({error_code: 'wrong_code', msg: 'Game for room code "' + req.params.accesscode.toUpperCase() + '" not found.'});

            return;
        }
        else
            locals.game = game;
            
        res.send({code: game.accessCode});

    });

};
