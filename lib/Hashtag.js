/**
 * Emerging Citizens
 * Developed by Engagement Lab, 2016
 * ==============
 * Hashtag You're It game controller
 *
 * @class Hashtag
 * @static
 * @author Johnny Richardson
 *
 * ==========
 */
var keystone = require('keystone');
var _ = require('underscore');
var TemplateLoader = new require('./TemplateLoader');

module.exports = function(gameSession) {

    var _SOCKET;
    var _SESSION = gameSession;
    var _PLAYERS = {};
    var _SUBMISSIONS = {};

    this.Events = function(EventEmitter) {
      
        EventEmitter.on('playerReady', function() {


        });

    };

    this.End = function(socket) {

        console.log('ending game')

        socket.to(_SESSION.accessCode).emit('game:end');

        delete _GAME_SESSIONS.gameSession;
        
    };

    this.PlayerReady = function(player, socket) {

        _PLAYERS[player.id] = player.username;

        console.log(_PLAYERS)

        if(Object.keys(_PLAYERS).length === _SESSION.playerCap) {
          require('./Tweet')(function(data) {

            TemplateLoader('index/tweet', data, function(html) {
              socket.to(_SESSION.accessCode).emit('game:start', html);
            });

            TemplateLoader('moderator/waiting', data, function(html) {
              socket.to(_SESSION.accessCode + '-moderator').emit('game:start', html);
            });
          
          });

        }

        socket.to(_SESSION.accessCode).emit('players:update', _PLAYERS);
        socket.to(_SESSION.accessCode + '-moderator').emit('players:update', _PLAYERS);

    };

    this.PlayerLost = function(player, socket) {

        /*var updatedPlayers = _.reject(_PLAYERS, function(thisPlayer) {

          return thisPlayer.id === player; 
        
        });*/

        delete _PLAYERS[player];

        console.log('left', player);

        socket.to(_SESSION.accessCode).emit('players:update', _PLAYERS);

    };

    this.GetTweet = function(id) {

        var Tweet = keystone.list('Tweet');
        var _twitter = keystone.get('twitter');

        var queryTweet = Tweet.model.findOne({}, {}, {
                sort: {
                    'createdAt': -1
                }
            });

        queryTweet.exec(function(err, tweet) {

            _twitter.get('statuses/lookup', {id: '695343359607468034'}, function(err, tweets, response) {
                
                if (err) throw error;

                callback(tweets[0].text.substring(0, tweets[0].text.indexOf('#')));

          });

        });

    };

    this.HashtagSubmitted = function(player, submission, socket) {

        _SUBMISSIONS[player] = submission;

        if(Object.keys(_SUBMISSIONS).length === _SESSION.playerCap) {

            socket.to(_SESSION.accessCode).emit('hashtags:received', _SUBMISSIONS);
            socket.to(_SESSION.accessCode + '-moderator').emit('hashtags:received', _SUBMISSIONS);

        }

    };

};