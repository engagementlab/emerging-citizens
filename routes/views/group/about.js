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
    About = keystone.list('AboutPage'),
    Person = keystone.list('Person');

exports = module.exports = function(req, res) {

    var view = new keystone.View(req, res);
    var locals = res.locals;

    // locals.section is used to set the currently selected
    // item in the header navigation.
    locals.section = 'index';
    locals.viewType = 'landing';

    view.on('init', function(next) {

        locals.person = [];

        About.model.findOne({}, {}, function (err, about) {

            locals.about = about;

            // next(err);

            Person.model.find({ enabled: true }, {}, function (err, person) {

                locals.person = person;

                next(err);

            });

        });

        

    });

    // Render the view
    view.render('about');

};