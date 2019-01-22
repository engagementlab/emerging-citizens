/* Emerging Citizens */
/**
 * Route definitions
 *
 * @module routes
 **/
var express = require('express');
var router = express.Router();
var keystone = require('keystone');
var middleware = require('./middleware');
var importRoutes = keystone.importer(__dirname);

// Common Middleware
keystone.pre('routes', middleware.initErrorHandlers);
keystone.pre('routes', middleware.initLocals);
// Handle 404 errors
keystone.set('404', function(req, res, next) {
    res.notfound();
});

// Import Route Controllers
var routes = {
    api: importRoutes('./api'),
    views: importRoutes('./views')
};

// Setup Route Bindings
router.all('/*', keystone.middleware.cors);

if(process.env.NODE_ENV === 'production') {
    router.all('/*', function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "https://ecplay.org");
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, HEAD, PUT');
        res.header('Access-Control-Expose-Headers', 'Content-Length');
        res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method");
        
        if(req.method === 'OPTIONS')
            res.send(200);
        else
            next();

    });
}

// Views
router.get('/', routes.views.index);
router.get('/play/:debug?', routes.views.game.play);
router.post('/login', routes.views.game.login);

// Group screen
router.get('/game/:accesscode/:debug?', routes.views.group.lobby);    

// router.get('/about', routes.views.group.about);
router.get('/about/:game_type?', routes.views.about);
router.get('/help', routes.views.group.help);
router.get('/lessonPlans', routes.views.group.lessonPlans);
router.get('/new/:game_type', routes.views.group.index);

router.post('/api/create/:game_type', keystone.middleware.api, routes.api.gamesession.create);
router.post('/api/load/', keystone.middleware.api, routes.api.templates.load);

// router.post('/login', routes.views.user.login);

	// router.all('/api/gameuser/create', keystone.initAPI, routes.api.gameusers.create);

module.exports = router;
    