/**
* Emerging Citizens
* Developed by Engagement Lab, 2016-19
* ==============
* Privacy policy view controller.
*
* Help: http://keystonejs.com/docs/getting-started/#routesviews-firstview
*
* @class views
* @static
* @author Johnny Richardson
*
* ==========
*/

var keystone = require('keystone');

exports = module.exports = function(req, res) {

    var view = new keystone.View(req, res);
    var locals = res.locals;

    locals.viewType = 'landing';
    locals.section = 'index';
    
    //  Load privacy text
    var About = keystone.list('AboutPage');
    
    view.on('init', function(next) {

        About.model.findOne({}, 'privacy.html -_id', function (err, aboutPrivacy) {

            locals.content = aboutPrivacy;
        
            next(err);

        });

    });

    // Render the view
    view.render('privacy');

};