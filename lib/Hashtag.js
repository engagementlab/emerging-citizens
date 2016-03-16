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
        _SESSION = gameSession,
        _PLAYERS = {},
        _HASHTAGS = {},
        _VOTES = {},
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

    this.DisplayTweet = function(tweetIndex) {

      require('./Tweet')(
        '695343359607468034', 
        function(data) {

            // Cache the real hashtag
            _REAL_HASHTAG = data.hashtag;

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

        _HASHTAGS[player] = submission;

        // All hashtags received
        if(Object.keys(_HASHTAGS).length === _SESSION.playerCap) {

            _HASHTAGS["moderator"] = _REAL_HASHTAG;
            
            // Randomize the hashtag order
            randomize(_HASHTAGS);
            
            Templates.Load('index/results', _HASHTAGS, function(html) {
                socket.to(_SESSION.accessCode).emit('hashtags:received', html);
            });

            Templates.Load('moderator/results', _.values(_HASHTAGS), function(html) {
                socket.to(_SESSION.accessCode + '-moderator').emit('hashtags:received', html);
            });

        }

    };

    this.HashtagVote = function(player, hashtagId, socket) {

        if(_VOTES[hashtagId] === undefined)
            _VOTES[hashtagId] = 0;
        else
            _VOTES[hashtagId]++; 

        var data = [];

        _.each(_HASHTAGS, function(val, key,  list) {

            if(_VOTES[key] !== undefined)
                data.push({hashtag: val, votes: _VOTES[key]});

        });

        socket.to(_SESSION.accessCode + '-moderator').emit('hashtags:voted', data);

        // All votes are in
        if(Object.keys(_VOTES).length === _SESSION.playerCap) {

            // Dispatch real hashtag
            socket.to(_SESSION.accessCode + '-moderator').emit('hashtag:reveal', _REAL_HASHTAG);

            // Advance round
            _CURRENT_ROUND++;

        }

    };


};