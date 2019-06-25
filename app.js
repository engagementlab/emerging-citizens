// Load .env vars
if(process.env.NODE_ENV !== 'test')
    require('dotenv').load();
 
const bootstrap = require('@engagementlab/el-bootstrapper'), 
      express = require('express');
 
let app = express();
let keystoneConf = {
    'name': 'Emerging Citizens CMS',
    'static': 'public'
};

// Load handlebars and our helpers
var handlebars = require('express-handlebars');
var hbsInstance = handlebars.create({
                                     layoutsDir: './templates/layouts',
                                     partialsDir: './templates/partials',
                                     defaultLayout: 'base',
                                     helpers: require('./templates/helpers')(),
                                     extname: '.hbs'
                                 });

app.set('views', './templates/views/');
app.engine('hbs', hbsInstance.engine);
app.set('view engine', 'hbs');

// Enables CORS for play domain on production, for static assets
if(process.env.NODE_ENV === 'production') {
	keystoneConf['static options'] = {
		'setHeaders': function(res, path) {
			res.header("Access-Control-Allow-Origin", "https://ecplay.org");
			res.header('Access-Control-Allow-Methods', 'GET, POST');
			res.header("Access-Control-Allow-Headers", "X-Requested-With");
		}
	};
}

bootstrap.start(
    // Path to config
    './config.json', 
    // Express
    app,
    // The root of this app on disk, needed for keystonejs
    __dirname + '/', 
    // Any additional config vars you want for keystonejs instance
    // See: https://keystonejs.com/documentation/configuration/
    keystoneConf,
    () => {
        // any logic to run after app is mounted
        // you need at least:
        app.listen(process.env.PORT);
    }
);
