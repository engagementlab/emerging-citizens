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
    api: importRoutes('./api'),
    views: importRoutes('./views')
};

// Setup Route Bindings
exports = module.exports = function(app) {

    // Views
    app.get('/', routes.views.index);
    app.get('/game/:type/', routes.views.game.entry);
    // app.get('/game/:accesscode/', routes.views.game.player);
    
    app.get('/moderator', routes.views.moderator.index);
    app.get('/moderator/monitor/:accesscode', routes.views.moderator.monitor);
    
    app.post('/api/create', keystone.middleware.api, routes.api.gamesession.create);
    // app.post('/login', routes.views.user.login);

  	// app.all('/api/gameuser/create', keystone.initAPI, routes.api.gameusers.create);

};
