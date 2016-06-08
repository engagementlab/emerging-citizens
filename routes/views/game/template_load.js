/**
 * Emerging Citizens
 * Developed by Engagement Lab, 2015
 * ==============
 * Game template loader (for debugging).
 *
 * Help: http://keystonejs.com/docs/getting-started/#routesviews-firstview
 *
 * @class game
 * @static
 * @author Johnny Richardson
 *
 * ==========
 */

var keystone = require('keystone'),
    appRoot = require('app-root-path'),
    Templates = require(appRoot + '/lib/TemplateLoader');

var debugData = {
    voting: {

        user1: {hashtag: 'pillows'},
        user2: {hashtag: 'sleep'},
        user3: {hashtag: 'bedtimemagic'},
        user4: {hashtag: 'pitchdecklife'},
        user5: {hashtag: 'advertisersanon'},
        user6: {hashtag: 'lesoreillers'},
        user7: {hashtag: 'headtohead'},
        user8: {hashtag: 'idontknowanythinganymore'}
    
    },
    submissions: {

        tweet: {
            html: "<p>Remember when Zoe claimed Maya had never worked for her?\nThat was a lie, Maya even tried to cover it up!</p>\n"
            
        },

        hashtags: [ {
            user1: {hashtag: 'pillows'},
            user2: {hashtag: 'sleep'},
            user3: {hashtag: 'bedtimemagic'},
            user4: {hashtag: 'pitchdecklife'}
            },
            {
            user5: {hashtag: 'advertisersanon'},
            user6: {hashtag: 'lesoreillers'},
            user7: {hashtag: 'headtohead'},
            user8: {hashtag: 'idontknowanythinganymore'}
            }
        ]
    },
    results: {

        round: 2,

        tweet: {
            html: "<p>Remember when Zoe claimed Maya had never worked for her?\nThat was a lie, Maya even tried to cover it up!</p>\n"
            
        },

        hashtags: {
            user1: {hashtag: 'pillows', user: { username: 'user4', index: 6, submitted: true }, votes: [
                                                                { 
                                                                    user: { username: 'user2', index: 2, submitted: true },
                                                                    score: 100 
                                                                },
                                                                {
                                                                    user: { username: 'user3', index: 3, submitted: true },
                                                                    score: 50 
                                                                }
                                                            ]},
            user2: {hashtag: 'sleep', user: { username: 'user5', index: 7, submitted: true }, real: true},
            user3: {hashtag: 'bedtimemagic',  user: { username: 'user6', index: 1, submitted: true }, votes: [
                                                                { 
                                                                    user: { username: 'user1', index: 4, submitted: true },
                                                                    score: 50 
                                                                }
                                                            ]}

        },

        players: {
                user1: {score_total: 350, username: 'user1'},
                user2: {score_total: 250, username: 'user2'},
                user4: {score_total: 200, username: 'user4'},
                user3: {score_total: 150, username: 'user3'},
                user5: {score_total: 150, username: 'user5'},
                user6: {score_total: 50, username: 'user6'},
                user7: {username: 'user7'},
                user8: {username: 'user8'}
            }
    },
    tweet: {

        players: {
            left: {
                user1: {username: 'pillows'},
                user2: {username: 'sleep'},
                user3: {username: 'bedtimemagic'}
            }
        },
        tweetText: {html: 'Remember when [blank] Maya had never worked for her? That was a lie, Maya even tried to cover it up!'}
    
    }
}

exports = module.exports = function(req, res) {

    var view = new keystone.View(req, res);
    var locals = res.locals;

    var data = (req.method == 'POST') ? req.body : req.query;

    locals.section = 'debug';

    console.log('template_path', data.template_path);
    
    Templates.Load(data.template_path, debugData[data.debug_key], function(html) {

        res.send({id: data.event_id, eventData: html});
    
    });

};
