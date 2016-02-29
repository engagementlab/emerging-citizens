/* Emerging Citizens */
/**
 * Route definitions
 *
 * @module routes
 **/
var keystone = require('keystone');
var middleware = require('./middleware');
var importRoutes = keystone.importer(__dirname);

// Common Middleware
keystone.pre('routes', middleware.initErrorHandlers);
keystone.pre('routes', middleware.initLocals);

// Import Route Controllers
var routes = {
    views: importRoutes('./views')
};

// Setup Route Bindings
exports = module.exports = function(app) {

    // Views
    app.get('/', routes.views.index);
    app.post('/login', routes.views.user.login);

  	app.all('/api/gameuser/create', keystone.initAPI, routes.api.gameusers.create);

};
