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
    LessonPlan = keystone.list('LessonPlan'),
    GameConfig = keystone.list('GameConfig'),
    ContentCategory = keystone.list('ContentCategory');

exports = module.exports = function(req, res) {

    // Check if game type specified
    if(!req.params.game_type)        
        return res.notfound('Game type not specified!', 'Sorry, but a game type needs to be specified.');  

    var view = new keystone.View(req, res);
    var locals = res.locals;

    var configGameType = req.params.game_type;
    var gameCode;

    var GameType = {
        'htyi' : "Hash Tag You're It",
        'wikigeeks' : "WikiGeeks"
        // 1 : "Wait, Wait, Don't Tell MEME",
    }

    // locals.section is used to set the currently selected
    // item in the header navigation.
    locals.section = 'group';

    view.on('init', function(next) {

        locals.categories = [];
        locals.lessonPlans = [];
        locals.whichGame = configGameType;

        var queryContent = ContentCategory.model.find({});

        queryContent.exec(function (err, category) {

            locals.categories = category;

        
        });

        queryPlan = LessonPlan.model.find({
                                    'enabled':true
                                    })
                                    .populate('relatedGame');

        queryPlan.exec(function (err, plans){

            // if (plans.relatedGame === gameType) {
                locals.lessonPlans = plans;

                console.log(plans);
            // }

            GameConfig.model.findOne({ }, function (err, game) {

                locals.game = game;

                next(err);
                
            });

            
        });



        // LessonPlan.model.find({ relatedGame: gameType }, {}, function (err, plans) {

        //     locals.gameType = gameType;

        //     locals.lessonPlans = plans;

        //     console.log(plans);

        //     
        // });

        

    });

    // Render the view
    view.render('group/game');

};