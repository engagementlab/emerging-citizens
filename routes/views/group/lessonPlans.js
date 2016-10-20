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
    Category = keystone.list('ContentCategory');

exports = module.exports = function(req, res) {

    var view = new keystone.View(req, res);
    var locals = res.locals;

    locals.viewType = 'landing';
    locals.section = 'lessons';

    view.on('init', function(next) {

        locals.plans = [];
        locals.categories = [];

        var queryPlans = LessonPlan.model
                                    .find({
                                        enabled: true
                                    })
                                    .sort([
                                        ['sortOrder', 'ascending']
                                    ])
                                    .populate('category')
                                    .populate('relatedGame');

        queryPlans.exec(function (err, plan) {

            locals.plans = plan;

            Category.model.find({ enabled: true }, {}, function (err, category){

                locals.categories = category;

                next(err);

            });
        });
    });

    // Render the view
    view.render('lessonPlans');

};