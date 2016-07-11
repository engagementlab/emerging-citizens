/**
 * Emerging Citizens
 * Developed by Engagement Lab, 2016
 * ==============
 * Moderator view controller.
 *
 * Help: http://keystonejs.com/docs/getting-started/#routesviews-firstview
 *
 * @class group
 * @static
 * @author Johnny Richardson
 *
 * ==========
 */
var keystone = require('keystone'),
    randomstring = require('randomstring'),
    GameSession = keystone.list('GameSession'),
    ContentCategory = keystone.list('ContentCategory');

exports = module.exports = function(req, res) {

    // Check if game type specified
    if(!req.params.game_type)        
        return res.notfound('Game type not specified!', 'Sorry, but a game type needs to be specified.');  

    var view = new keystone.View(req, res);
    var locals = res.locals;

    var gameType = req.params.game_type;
    var gameCode;

    var GameType = {
        'htyi' : "Hash Tag You're It",
        'wikigeeks' : "WikiGeeks"
        // 1 : "Wait, Wait, Don't Tell MEME",
    }

    // locals.section is used to set the currently selected
    // item in the header navigation.
    locals.section = 'group';

    function generateCode() {

        return randomstring.generate({ length: 4, charset: 'alphabetic' }).toUpperCase();
    
    }

    view.on('init', function(next) {

        gameCode = generateCode();

        // Check if there's already a game with the generated access code
        GameSession.model.findOne({accessCode: gameCode}, function (err, session) {

            // There is! A one in 15,000 probability! Make a new one
            if(session !== null)
                gameCode = generateCode();

            next();

        });

    });

    view.on('init', function(next) {

        // Get game config and content buckets (categories)
        ContentCategory.model.find({}, 'topicName', function (err, categories) {

            locals.gameCode = gameCode;
            locals.gameType = gameType;

            locals.categories = categories;

            next(err);

        });

    });

    // Render the view
    view.render('group');

};