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

var keystone = require('keystone');

exports = module.exports = function(req, res) {

    var view = new keystone.View(req, res);
    var locals = res.locals;
    var configGameType = req.params.game_type;

    locals.viewType = 'landing';
    
    // Load generic 'about' page
    if(!configGameType) {

        var About = keystone.list('AboutPage'),
        Person = keystone.list('Person');
        
        locals.section = 'index';

        view.on('init', function(next) {

            locals.person = [];

            About.model.findOne({}, {}, function (err, about) {

                locals.about = about;

                Person.model.find({ enabled: true }, {}, function (err, person) {

                    locals.person = person;

                    next(err);

                });

            });

        });

        // Render the view
        view.render('about');

    }
    
    // Load about for specified game
    else {

        var gameCode,
        LessonPlan = keystone.list('LessonPlan'),
        GameConfig = keystone.list('GameConfig'),
        ContentCategory = keystone.list('ContentCategory');

        locals.section = configGameType.toUpperCase();

        // locals.section is used to set the currently selected
        // item in the header navigation.
        view.on('init', function(next) {
            
            locals.categories = [];
            locals.lessonPlans = [];
            locals.whichGame = configGameType.toUpperCase();

            var queryContent = ContentCategory.model.find({});

            var queryPlan = LessonPlan.model.find({
                                        'enabled':true
                                        })
                                        .populate('relatedGame')
                                        .populate('category');

            var queryGame = GameConfig.model.findOne({
                                        'enabled':true,
                                        'gameType':new RegExp('^'+locals.whichGame+'$', "i")
                                        });

            queryPlan.exec(function (err, plans) {

                /*_.each(plans, function(plan, index){
                    plan.relatedGame.gameType = plan.relatedGame.gameType.toUpperCase();
                });*/
                
                locals.lessonPlans = plans;

                queryContent.exec(function (err, category) {

                    locals.categories = category;
            
                    queryGame.exec(function (err, game) {

                        locals.game = game;

                        next(err);
                        
                    });

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

    }

};