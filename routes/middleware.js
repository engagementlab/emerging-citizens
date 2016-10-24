/* Emerging Citizens */
/**
 * Route middleware
 * This file contains the common middleware used by all routes. Extend or replace these functions as the application requires.
 *
 * @class middleware
 * @namespace routes
 * @author Johnny Richardson
 * @constructor
 * @static
 **/

var keystone = require('keystone');

/**
	Initialises the standard view locals
*/

exports.initLocals = function(req, res, next) {

    var locals = res.locals;
    locals.user = req.user;

    next();

};


/**
	Prevents people from accessing protected pages when they're not signed in
 */

exports.requireUser = function(req, res, next) {

    if (!req.user) {
        req.flash('error', 'Please sign in to access this page.');
        res.redirect('/keystone/signin');
    } else {
        next();
    }

};


/**
    Inits the error handler functions into `req`
*/

exports.initErrorHandlers = function(req, res, next) {
    
    res.err = function(err, title, message) {
        res.status(500).render('errors/500', {
            err: err,
            errorTitle: title,
            errorMsg: message
        });
    };
    
    res.notfound = function(title, message) {
        res.status(404).render('errors/404', {
            viewType: 'landing',
            errorTitle: title,
            errorMsg: message
        });
    };
    
    next();
    
};