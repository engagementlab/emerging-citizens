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
    Templates = require('./TemplateLoader'),
    Session = require('./SessionManager'),
    Sentencer = require('sentencer');

module.exports = function(gameSession) {

    var _SOCKET,
        _COUNTDOWN,
        _EVENT_COUNTDOWN_DONE,
        _CURRENT_ROUND,
        _CURRENT_TWEET,
        _CURRENT_HASHTAGS = {},
        _GAME_SESSION = gameSession,
        _PLAYERS = {},
        _VOTES = 0,
        _CONFIG = {},
        _REAL_HASHTAG;

    var _ALL_HASHTAGS = {},
        _ALL_SCORES = {};

    function Reset() {

        // Stop countdown
        clearInterval(_COUNTDOWN);
        _COUNTDOWN = undefined;

        _PLAYERS = {};
        _CURRENT_HASHTAGS = {};

    }

    function Countdown(socket) {

        if(_COUNTDOWN !== undefined) 
            clearInterval(_COUNTDOWN);

        // Mins * 60 to get seconds
        var timeLeft = _GAME_SESSION.timeLimit * 60;
        _COUNTDOWN = setInterval(function() {

            timeLeft--;

            if(timeLeft === 0) {

                clearInterval(_COUNTDOWN);
                _EVENT_COUNTDOWN_DONE(socket);

                // Dispatch countdown when done for player
                Templates.Load('player/timeout', undefined, function(html) {
                    socket.to(_GAME_SESSION.accessCode).emit('game:countdown_end', html);
                });

            }
            else if(timeLeft === 30) {

                // Dispatch countdown when done for player
                Templates.Load('player/timerunningout', undefined, function(html) {
                    socket.to(_GAME_SESSION.accessCode).emit('game:countdown_ending', html);
                });

            }
        
        }, 1000);
        
        socket.to(_GAME_SESSION.accessCode + '-moderator').emit('game:countdown', timeLeft);
    
    }

    function CalcPlayerScore(playerId, real) {

        var points = (real === true) ? _CONFIG.voteScoreReal : _CONFIG.voteScoreGuess;

        if(playerId === 'moderator')
            return;

        if(_PLAYERS[playerId].score_total === undefined)
            _PLAYERS[playerId].score_total = points;
        else
            _PLAYERS[playerId].score_total += points;

        return _PLAYERS[playerId].score_total;

    }

    function StartVoting(socket) {

        // Submit random hashtags for players who did not submit!
        _.each(_.keys(_PLAYERS), function(id, index) {

            if(_CURRENT_HASHTAGS[id] === undefined)
                _CURRENT_HASHTAGS[id] = { hashtag: Sentencer.make('{{noun}}'), username: _PLAYERS[id].username };

        });

        // Add real hashtag
        _CURRENT_HASHTAGS["moderator"] = { hashtag: _REAL_HASHTAG, real: true };
        
        // Randomize the hashtag order
        randomize(_CURRENT_HASHTAGS);
        
        Templates.Load('player/voting', _CURRENT_HASHTAGS, function(html) {
            socket.to(_GAME_SESSION.accessCode).emit('hashtags:received', html);
        });

        Templates.Load('moderator/voting', undefined, function(html) {
            socket.to(_GAME_SESSION.accessCode + '-moderator').emit('hashtags:received', html);
        });

        // Reset vote count
        _VOTES = 0;

        // Begin voting countdown and assign countdown end event
        Countdown(socket);
        _EVENT_COUNTDOWN_DONE = ShowResults;

    }

    function ShowResults(socket) {

        // Stop countdown
        clearInterval(_COUNTDOWN);

        var data = {    
                        hashtags: _CURRENT_HASHTAGS, 
                        tweet: _CURRENT_TWEET,
                        players: _PLAYERS 
                   };

        Templates.Load('moderator/results', data, function(html) {
            socket.to(_GAME_SESSION.accessCode + '-moderator').emit('hashtags:reveal', html);
        });

        Templates.Load('player/results', undefined, function(html) {
            socket.to(_GAME_SESSION.accessCode).emit('game:round_over', html);
        });
        
    }

    this.Initialize = function() {
        
        var keystone = require('keystone');
        var Tweet = keystone.list('Tweet').model;
        var GameConfig = keystone.list('GameConfig').model;
    
        // Populate content buckets for this session
        Tweet.find({'category': { $in: gameSession.contentCategories}}, function(err, result) {

            _GAME_SESSION.tweets = result;

        });

        // Get config for HTYI game
        var queryConfig = GameConfig.findOne({}, {}, {
            sort: {
                'createdAt': -1
            }
        });
        queryConfig.exec(function(err, resultConfig) {

            _CONFIG = resultConfig;

        });
    
    }

    // Game ended
    this.End = function(socket) {

        Reset();

        Templates.Load('player/end', undefined, function(html) {
            socket.to(_GAME_SESSION.accessCode).emit('game:end', html);
        });

        Templates.Load('moderator/end', undefined, function(html) {
            
            socket.to(_GAME_SESSION.accessCode + '-moderator').emit('game:end', html);

        });

        Session.Delete(_GAME_SESSION.accessCode);
        
    };

    this.AdvanceRound = function(socket) {

        // End of game?
        if(_CURRENT_ROUND === _GAME_SESSION.tweets.length-1)
        {
            this.End();
            return;
        }

        // Store and reset hashtags
        _ALL_HASHTAGS[_CURRENT_ROUND] = _CURRENT_HASHTAGS;
        _CURRENT_HASHTAGS = {};

        // Advance round and show next tweet
        _CURRENT_ROUND++;
        this.DisplayTweet(_CURRENT_ROUND, socket);

    };

    this.PlayerReady = function(player, socket) {

        _PLAYERS[player.id] = {};
        _PLAYERS[player.id].username = player.username;

        if(Object.keys(_PLAYERS).length === _GAME_SESSION.playerCap) {
            // First round
            _CURRENT_ROUND = 0;
            this.DisplayTweet(_CURRENT_ROUND, socket);
        }

        socket.to(_GAME_SESSION.accessCode).emit('players:update', _PLAYERS);
        socket.to(_GAME_SESSION.accessCode + '-moderator').emit('players:update', _PLAYERS);

    };

    this.PlayerLost = function(player, socket) {

        delete _PLAYERS[player];

        console.log('left', player);
        console.log('players left', player);

        socket.to(_GAME_SESSION.accessCode).emit('players:update', _PLAYERS);

        if(Object.keys(_PLAYERS).length === 0)
            Reset();

    };

    this.DisplayTweet = function(tweetIndex, socket) {

        var data = _GAME_SESSION.tweets[tweetIndex];

        // Cache the real hashtag and tweet
        _REAL_HASHTAG = data.hashtag;
        _CURRENT_TWEET = data.tweetText;

        Templates.Load('player/tweet', data.tweetText, function(html) {
          socket.to(_GAME_SESSION.accessCode).emit('game:start', html);
        });

        Templates.Load('moderator/waiting', data.tweetText, function(html) {
            
            socket.to(_GAME_SESSION.accessCode + '-moderator').emit('game:start', html);
        
            // Begin first countdown and assign end event
            Countdown(socket);
            _EVENT_COUNTDOWN_DONE = StartVoting;

        });

    }

    this.HashtagSubmitted = function(player, submission, socket) {

        _CURRENT_HASHTAGS[player] = { hashtag: submission, username: _PLAYERS[player].username };

        // All hashtags received; voting begins
        if(Object.keys(_CURRENT_HASHTAGS).length === _GAME_SESSION.playerCap) {
            
            StartVoting(socket);
        
        }
        else {

            Templates.Load('moderator/waiting', _.values(_CURRENT_HASHTAGS), function(html) {
              socket.to(_GAME_SESSION.accessCode + '-moderator').emit('hashtag:submitted', html);
            });

        }

    };

    this.HashtagVote = function(player, playerId, socket) {

        var thisHashtag = _CURRENT_HASHTAGS[playerId];

        // Save vote for hashtag
        if(thisHashtag.votes === undefined) {

            thisHashtag.votes = [ _PLAYERS[player] ];

            // Mark hashtag as the "real" one or not?
            thisHashtag.real = (thisHashtag.hashtag == _REAL_HASHTAG);

        }
        else
            thisHashtag.votes.push(_PLAYERS[player]);

        _VOTES++;

        thisHashtag.score = CalcPlayerScore(playerId, thisHashtag.real);

        // All votes are in, show results
        console.log('HashtagVote', _VOTES + ' --- ' + _GAME_SESSION.playerCap)
        if(_VOTES >= _GAME_SESSION.playerCap)
            ShowResults(socket);

    };


};