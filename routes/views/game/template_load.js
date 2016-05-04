/**
 * Emerging Citizens
 * Developed by Engagement Lab, 2015
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
    Templates = require(appRoot + '/lib/TemplateLoader');

var debugData = {
    voting: {

        user1: {hashtag: 'pillows'},
        user2: {hashtag: 'sleep'},
        user3: {hashtag: 'bedtimemagic'},
        user4: {hashtag: 'pitchdecklife'},
        user5: {hashtag: 'advertisersanon'},
        user6: {hashtag: 'lesoreillers'},
        user7: {hashtag: 'headtohead'},
        user8: {hashtag: 'idontknowanythinganymore'}
    
    }
}

exports = module.exports = function(req, res) {

    var view = new keystone.View(req, res);
    var locals = res.locals;

    var data = (req.method == 'POST') ? req.body : req.query;

    // locals.section is used to set the currently selected
    // item in the header navigation.
    locals.section = 'debug';
    
    Templates.Load(data.template_path, debugData[data.debug_key], function(html) {            
        res.send(html);
    });

};
