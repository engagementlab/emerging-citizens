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
    app.get('/play/:debug?', routes.views.game.play);
    app.post('/game', routes.views.game.player);
    app.post('/game/load', routes.views.game.template_load);
    
    app.get('/group', routes.views.group.index);
    app.get('/new', routes.views.group.index);
    app.get('/group/monitor/:accesscode/:debug?', routes.views.group.monitor);
    app.get('/:accesscode/:debug?', routes.views.group.monitor);
    
    app.post('/api/create', keystone.middleware.api, routes.api.gamesession.create);
    // app.post('/login', routes.views.user.login);

  	// app.all('/api/gameuser/create', keystone.initAPI, routes.api.gameusers.create);

};
