/**
 * Emerging Citizens
 * Developed by Engagement Lab, 2015
 * ==============
 * Home page view controller.
 *
 * Help: http://keystonejs.com/docs/getting-started/#routesviews-firstview
 *
 * @class index
 * @static
 * @author Johnny Richardson
 *
 * ==========
 */
var keystone = require('keystone');
var _ = require('underscore');
var Tweet = keystone.list('Tweet');
var _twitter = keystone.get('twitter');

module.exports = function(tweetId, callback) {

 	var queryTweet = Tweet.model.findOne({}, {}, {
        sort: {
            'createdAt': -1
        }
    });

    queryTweet.exec(function(err, tweet) {

    	_twitter.get('statuses/lookup', { id: tweetId }, function(err, tweets, response) {
            
            if (err) throw error;

            var tweetContent = tweets[0].text.substring(0, tweets[0].text.indexOf('#'));
            var hashtagContent = tweets[0].text.substring(tweets[0].text.indexOf('#'), tweets[0].text.length);

            console.log("tweet", tweetContent)
            console.log("hash", hashtagContent)

        	callback( {tweet: tweetContent, hashtag: hashtagContent} );

      });

    });

};
