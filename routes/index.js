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

    app.all('/*', keystone.middleware.cors);

    // Views
    app.get('/', routes.views.index);
    app.get('/play/:debug?', routes.views.game.play);
    app.post('/login', routes.views.game.login);

    // Group screen
    app.get('/game/:accesscode/:debug?', routes.views.group.lobby);    
    
    app.get('/about/:game_type', routes.views.group.game);
    app.get('/about', routes.views.group.about);
    app.get('/help', routes.views.group.help);
    app.get('/lessonPlans', routes.views.group.lessonPlans);
    app.get('/new/:game_type', routes.views.group.index);
    
    app.post('/api/create/:game_type', keystone.middleware.api, routes.api.gamesession.create);
    app.post('/api/load/', keystone.middleware.api, routes.api.templates.load);
    
    // app.post('/login', routes.views.user.login);

  	// app.all('/api/gameuser/create', keystone.initAPI, routes.api.gameusers.create);


};
