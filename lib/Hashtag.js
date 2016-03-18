/**
 * Emerging Citizens
 * Developed by Engagement Lab, 2016
 * ==============
 * Hashtag You're It game controller
 *
 * @class lib
 * @static
 * @author Johnny Richardson
 *
 * ==========
 */
var _ = require('underscore'),
    randomize = require('randomize-obj'),
    Templates = require('./TemplateLoader');

module.exports = function(gameSession) {

    var _SOCKET,
        _COUNTDOWN,
        _CURRENT_ROUND,
        _CURRENT_TWEET,
        _SESSION = gameSession,
        _PLAYERS = {},
        _HASHTAGS = {},
        _VOTES = 0,
        _REAL_HASHTAG;

    function Reset() {

        // Stop countdown
        clearInterval(_COUNTDOWN);
        _COUNTDOWN = undefined;

        _HASHTAGS = {};

    }

    this.End = function(socket) {

        console.log('ending game')

        Reset();

        socket.to(_SESSION.accessCode).emit('game:end');

        delete _GAME_SESSIONS.gameSession;
        
    };

    this.PlayerReady = function(player, socket) {

        _PLAYERS[player.id] = player.username;

        if(Object.keys(_PLAYERS).length === _SESSION.playerCap) {
            // First round
            _CURRENT_ROUND = 0;
            this.DisplayTweet(_CURRENT_ROUND, socket);
        }

        socket.to(_SESSION.accessCode).emit('players:update', _PLAYERS);
        socket.to(_SESSION.accessCode + '-moderator').emit('players:update', _PLAYERS);

    };

    this.PlayerLost = function(player, socket) {

        delete _PLAYERS[player];

        console.log('left', player);
        console.log('players left', player);

        socket.to(_SESSION.accessCode).emit('players:update', _PLAYERS);

        if(Object.keys(_PLAYERS).length === 0)
            Reset();

    };

    this.DisplayTweet = function(tweetIndex, socket) {

      require('./Tweet')(
        _SESSION.hashtagIds[tweetIndex], 
        function(data) {

            // Cache the real hashtag and tweet
            _REAL_HASHTAG = data.hashtag;
            _CURRENT_TWEET = data.tweet;

            Templates.Load('index/tweet', data.tweet, function(html) {
              socket.to(_SESSION.accessCode).emit('game:start', html);
            });

            Templates.Load('moderator/waiting', data.tweet, function(html) {
              socket.to(_SESSION.accessCode + '-moderator').emit('game:start', html);
            });

            if(_COUNTDOWN === undefined) {
                // Mins * 60 to get seconds
                var timeLeft = _SESSION.timeLimit * 60;
                _COUNTDOWN = setInterval(function() {

                    timeLeft--;

                    if(timeLeft === 0)
                        clearInterval(_COUNTDOWN);

                    socket.to(_SESSION.accessCode).emit('game:countdown', timeLeft);
                    socket.to(_SESSION.accessCode + '-moderator').emit('game:countdown', timeLeft);
                
                }, 1000);
            }
          
        });

    }

    this.HashtagSubmitted = function(player, submission, socket) {

        _HASHTAGS[player] = { hashtag: submission };

        Templates.Load('moderator/voting', undefined, function(html) {
            socket.to(_SESSION.accessCode + '-moderator').emit('hashtags:received', html);
        });

        // All hashtags received
        if(Object.keys(_HASHTAGS).length === _SESSION.playerCap) {

            _HASHTAGS["moderator"] = { hashtag: _REAL_HASHTAG };
            
            // Randomize the hashtag order
            randomize(_HASHTAGS);
            
            Templates.Load('index/voting', _HASHTAGS, function(html) {
                socket.to(_SESSION.accessCode).emit('hashtags:received', html);
            });

            Templates.Load('moderator/voting', undefined, function(html) {
                socket.to(_SESSION.accessCode + '-moderator').emit('hashtags:received', html);
            });

            // Reset vote count
            _VOTES = 0;

        }

    };

    this.HashtagVote = function(player, hashtagId, socket) {

        // Save vote for hashtag
        if(_HASHTAGS[hashtagId].votes === undefined)
            _HASHTAGS[hashtagId].votes = [ _PLAYERS[player] ];
        else
            _HASHTAGS[hashtagId].votes.push(_PLAYERS[player]); 

        _VOTES++;

        // All votes are in
        if(_VOTES >= _SESSION.playerCap) {

            var data = { hashtags: _HASHTAGS, tweet: _CURRENT_TWEET };

            console.log("REVEAL: ", data);

            // socket.to(_SESSION.accessCode + '-moderator').emit('hashtags:reveal', _HASHTAGS);

            Templates.Load('moderator/results', data, function(html) {
                socket.to(_SESSION.accessCode + '-moderator').emit('hashtags:reveal', html);
            });

            // Advance round
            _CURRENT_ROUND++;

        }

    };


};