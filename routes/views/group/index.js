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
    GameSession = keystone.list('GameSession'),
    GameConfig = keystone.list('GameConfig'),
    ContentCategory = keystone.list('ContentCategory');

exports = module.exports = function(req, res) {

    // Check if game type specified
    if(!req.params.game_type)        
        return res.notfound('Game type not specified!', 'Sorry, but a game type needs to be specified.');  

    var view = new keystone.View(req, res);
    var locals = res.locals;

    var gameType = req.params.game_type;

    var gameCode;

    locals.viewType = 'group';
    locals.section = 'newgame';

    // Prevents generated code from being vulgar
    function checkCode(code, callback) {

        var fourLetter = ['ANUS', 'ARSE', 'CLIT', 'COCK', 'COON', 'CUNT', 'DAGO', 'DAMN', 'DICK', 'DIKE', 'DYKE', 'FUCK', 'GOOK', 'HEEB', 'HECK', 'HELL', 'HOMO', 'JIZZ', 'KIKE', 'KUNT', 'KYKE', 'LICK', 'MICK', 'MUFF', 'PAKI', 'PISS', 'POON', 'PUTO', 'SHIT', 'SHIZ', 'SLUT', 'SMEG', 'SPIC', 'TARD', 'TITS', 'TWAT', 'WANK', 'POOP', 'FUCK', 'FCUK', 'FUKK', 'KILL', 'JERK', 'CRAP', 'FOOK', 'DORK', 'DOPE', 'DUNG', 'FAGS', 'FART', 'GAYS', 'HELL', 'HOAR', 'JAPS', 'NAZI', 'ORGY', 'PORN', 'PUKE', 'RAPE', 'SEXY', 'SPIG', 'SUCK', 'STAB', 'SMUT', 'SPAZ', 'TWIT'];
        var threeLetter = ['ASS','FUC','FUK','FUQ','FUX','FCK','COC','COK','COQ','KOX','KOC','KOK','KOQ','CAC','CAK','CAQ','KAC','KAK','KAQ','DIC','DIK','DIQ','DIX','DCK','PNS','PSY','FAG','FGT','NGR','NIG','CNT','KNT','SHT','DSH','TWT','BCH','CUM','CLT','KUM','KLT','SUC','SUK','SUQ','SCK','LIC','LIK','LIQ','LCK','JIZ','JZZ','GAY','GEY','GEI','GAI','VAG','VGN','SJV','FAP','PRN','LOL','JEW','JOO','GVR','PUS','PIS','PSS','SNM','TIT','FKU','FCU','FQU','HOR','SLT','JAP','WOP','KIK','KYK','KYC','KYQ','DYK','DYQ','DYC','KKK','JYZ','PRK','PRC','PRQ','MIC','MIK','MIQ','MYC','MYK','MYQ','GUC','GUK','GUQ','GIZ','GZZ','SEX','SXX','SXI','SXE','SXY','XXX','WAC','WAK','WAQ','WCK','POT','THC','VAJ','VJN','NUT','STD','LSD','POO','AZN','PCP','DMN','ORL','ANL','ANS','MUF','MFF','PHK','PHC','PHQ','XTC','TOK','TOC','TOQ','MLF','RAC','RAK','RAQ','RCK','SAC','SAK','SAQ','PMS','NAD','NDZ','NDS','WTF','SOL','SOB','FOB','SFU'];

        if (_.contains (fourLetter, code))
            checkCode(generateCode(), callback);
        
        else if(threeLetter.some(function(s) { return code.indexOf(s) >= 0; }))
            checkCode(generateCode(), callback);

        else
            callback(code);

    }

    function generateCode() {
        
        var code = randomstring.generate({ length: 4, charset: 'alphabetic' }).toUpperCase();
        return code;

    }

    view.on('init', function(next) {

        var generatedCode = generateCode();

        // Make sure code is not vulgar and then check if not used already
        checkCode(generatedCode, function(code) {

            gameCode = code;

            res.setHeader('Game-Code', code);

            // Check if there's already a game with the generated access code
            GameSession.model.findOne({accessCode: gameCode}, function (err, session) {

                // There is! A one in 15,000 probability! Make a new one
                if(session !== null)
                    gameCode = generateCode();

                next(err);

            });

        });

    });

    view.on('init', function(next) {

        locals.whichGame = gameType.toUpperCase();

         var queryGame = GameConfig.model.findOne({
                                    'enabled':true,
                                    'gameType':new RegExp('^'+locals.whichGame+'$', "i")
                                    });

        // Get game config and content buckets (categories)
        ContentCategory.model.find({ 'enabled': true }, {}, function (err, categories) {

            locals.gameCode = gameCode;
            locals.gameType = gameType;
            locals.categories = categories;
            
            queryGame.exec(function (err, game) {
                locals.game = game;
                
                next(err);
            });

        });

    });

    // Render the view
    view.render('group');

};