/**
 * Emerging Citizens
 * Developed by Engagement Lab, 2016
 * ==============
 * Game template loader (for debugging).
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
    appRoot = require('app-root-path'),
    TemplateLoader = require(appRoot + '/lib/TemplateLoader'),
    GameSession = keystone.list('GameSession');

// var debugData = 

exports.load = function(req, res) {

    var locals = res.locals;

    var data = (req.method == 'POST') ? req.body : req.query;

    locals.section = 'debug';

    GameSession.model.findOne({ accessCode: 'TEST' }).exec(function (err, game) {

        var Templates = new TemplateLoader(game.gameType);
        var templateData;

        if(game._doc.debugData)
            templateData = game._doc.debugData[data.event_id];

        Templates.Load(data.template_path, templateData, function(html) {

            res.send({id: data.event_id, eventData: html});

        }); 

    });
    
    

};
