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

    // locals.section is used to set the currently selected
    // item in the header navigation.
    

    view.on('init', function(next) {

        locals.section = 'group-' + configGameType.toUpperCase();

        locals.categories = [];
        locals.lessonPlans = [];
        locals.whichGame = configGameType.toUpperCase();

        var queryContent = ContentCategory.model.find({});

        queryContent.exec(function (err, category) {

            locals.categories = category;
        
        });

        queryPlan = LessonPlan.model.find({
                                    'enabled':true
                                    })
                                    .populate('relatedGame')
                                    .populate('category');

        queryPlan.exec(function (err, plans) {

            // if (plans.relatedGame === gameType) {
                locals.lessonPlans = plans;
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