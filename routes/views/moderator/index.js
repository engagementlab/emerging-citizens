/**
 * Emerging Citizens
 * Developed by Engagement Lab, 2016
 * ==============
 * Moderator view controller.
 *
 * Help: http://keystonejs.com/docs/getting-started/#routesviews-firstview
 *
 * @class moderator
 * @static
 * @author Johnny Richardson
 *
 * ==========
 */
var keystone = require('keystone'),
    _ = require('underscore'),
    randomstring = require('randomstring'),
    appRoot = require('app-root-path'),
    ContentCategory = keystone.list('ContentCategory');

exports = module.exports = function(req, res) {

    var view = new keystone.View(req, res);
    var locals = res.locals;

    var GameType = {
        0 : "Hash Tag You're It"
        // 1 : "Wait, Wait, Don't Tell MEME",
        // 2 : "WikiGeeks"
    }

    // locals.section is used to set the currently selected
    // item in the header navigation.
    locals.section = 'moderator';

    view.on('init', function(next) {

        // Get game config and content buckets (categories)
        ContentCategory.model.find({}, 'name', function (err, categories) {

            locals.gameCode = randomstring.generate({
                                                      length: 4,
                                                      charset: 'alphabetic'
                                                    }).toUpperCase();
            locals.gameTypes = _.values(GameType);

            locals.categories = categories;

            next(err);

        });

    });

    // Render the view
    view.render('moderator');

};