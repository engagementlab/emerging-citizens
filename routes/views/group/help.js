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
    FAQ = keystone.list('FAQ');

exports = module.exports = function(req, res) {

    var view = new keystone.View(req, res);
    var locals = res.locals;

    locals.viewType = 'landing';
    locals.section = 'help';

    view.on('init', function(next) {

        var queryFAQ = FAQ.model
                            .find({
                                enabled: true
                            })
                            .sort (
                                '-category'
                            )
                            .populate('category');

        queryFAQ.exec(function (err, faq) {

            locals.faq = faq;
            // locals.

            // FAQCategory.model.find({ enabled: true}, {}, function (err, category) {

            //     locals.category = category;

                next(err);

            // });

        });

        

    });

    // Render the view
    view.render('help');

};