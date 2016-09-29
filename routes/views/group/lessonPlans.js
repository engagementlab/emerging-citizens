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
    Person = keystone.list('Person');

exports = module.exports = function(req, res) {

    var view = new keystone.View(req, res);
    var locals = res.locals;

    // locals.section is used to set the currently selected
    // item in the header navigation.
    locals.section = 'lessonPlans';

    view.on('init', function(next) {

        locals.plans = [];

        var queryPlans = LessonPlan.model
                                    .find({
                                        enabled: true
                                    })
                                    .sort([
                                        ['sortOrder', 'ascending']
                                    ])
                                    .populate('contentCategories')
                                    .populate('game');

        queryPlans.exec(function (err, plan) {

            locals.plans = plan;

            next(err);

        });

        

    });

    // Render the view
    view.render('lessonPlans');

};