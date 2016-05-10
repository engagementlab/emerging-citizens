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

        tweet: {
            html: "<p>Remember when Zoe claimed Maya had never worked for her?\nThat was a lie, Maya even tried to cover it up!</p>\n"
            
        },

        hashtags: {
            user1: {hashtag: 'pillows', username: 'user1', votes: [
                                                                { 
                                                                    username: 'user2',
                                                                    score: 50 
                                                                },
                                                                {
                                                                    username: 'user3',
                                                                    score: 50 
                                                                }
                                                            ]},
            user2: {hashtag: 'sleep', username: 'user2', real: true},
            user3: {hashtag: 'bedtimemagic', username: 'user3', votes: [
                                                                { 
                                                                    username: 'user1',
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
                user7: {score_total: 0, username: 'user7'},
                user8: {score_total: 0, username: 'user8'}
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
        tweetText: 'Remember when Zoe claimed Maya had never worked for her? That was a lie, Maya even tried to cover it up!'
    
    }
}

exports = module.exports = function(req, res) {

    var view = new keystone.View(req, res);
    var locals = res.locals;

    var data = (req.method == 'POST') ? req.body : req.query;

    // locals.section is used to set the currently selected
    // item in the header navigation.
    locals.section = 'debug';
    
    Templates.Load(data.template_path, debugData[data.debug_key], function(html) {            
        res.send({id: data.event_id, eventData: html});
    });

};
