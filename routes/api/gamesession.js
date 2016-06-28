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
    WikiGame = keystone.list('WikiGame'),
    Game = require(appRoot + '/lib/GameManager'),
    Session = require(appRoot + '/lib/SessionManager'),
    ContentCategory = keystone.list('ContentCategory');

/**
 * Create a GameSession
 */
exports.create = function(req, res) {

    var sessionType;
    var data = (req.method == 'POST') ? req.body : req.query;

    ContentCategory.model.find({}, 'name', function (err, categories) {

        // TEMP: Pull all categories for all games
        data.contentCategories = categories;

        if(data.contentCategories === undefined || data.contentCategories.length === 0) {
           res.send({error_code: 'need_content', msg: 'You must include at least one type of content.'});
           return;
        }

        data.gameType = "1";
        
        if(data.gameType === "0") {
            console.log ("starting HTYI");
            sessionType = new HashtagGame.model();
        } 
        if (data.gameType === "1") {
            console.log ("starting WikiGeeks");
            sessionType = new WikiGame.model();
        }

        // TODO: temporary
        // data.gameType = "0";

        sessionType.getUpdateHandler(req).process(data, function(err) {
            
            if (err) return res.apiError('error', err);
            // console.log (data.accessCode + " ...data.accessCode");
            // Save this session to memory for faster retrieval (deleted when game ends)
            Session.Create(data.accessCode, new Game(sessionType));


            res.send('/game/' + data.accessCode);
            
        });

    });
};
