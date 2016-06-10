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
    randomstring = require('randomstring'),
    logger = require('winston'),

    Templates = require('./TemplateLoader'),
    Session = require('./SessionManager'),
    shuffle = require('./ShuffleUtil'),
    Sentencer = require('sentencer');

module.exports = function(gameSession) {

    var _SOCKET,
        _COUNTDOWN,
        _EVENT_COUNTDOWN_DONE,
        _CURRENT_ROUND,
        _CURRENT_TWEET,
        _CURRENT_SUBMISSIONS = [],
        _GAME_TIMEOUT,
        _GAME_SESSION = gameSession,
        _PLAYERS = {},
        _VOTES = 0,
        _CONFIG = {},
        _REAL_HASHTAG;

    var _ALL_HASHTAGS = {},
        _ALL_TWEETS;

    // ID to indentify "real" hashtag
    var realId = randomstring.generate();
    var currentPlayerCap;
    var currentPlayerIndex = 0;

    // Identify targets for socket events
    var PLAYERS_ID = _GAME_SESSION.accessCode,
        GROUP_ID = _GAME_SESSION.accessCode + '-group';

    function Reset() {

        // Stop countdown
        clearInterval(_COUNTDOWN);
        _COUNTDOWN = undefined;

        _PLAYERS = {};
        _CURRENT_SUBMISSIONS = [];

        currentPlayerIndex = 0;

        console.info('Game "' + _GAME_SESSION.accessCode + '" ended! ');

    }

    function Countdown(socket) {

        if(_COUNTDOWN !== undefined) 
            clearInterval(_COUNTDOWN);

        // Mins * 60 to get seconds
        var timeLeft = _CONFIG.timeLimit * 60;
        _COUNTDOWN = setInterval(function() {

            timeLeft--;

            if(timeLeft === 0) {

                clearInterval(_COUNTDOWN);
                _EVENT_COUNTDOWN_DONE(socket);

            }
            else if(timeLeft === 30) {

                // Dispatch countdown when running out of time for player
                Templates.Load('partials/player/timerunningout', undefined, function(html) {
                    socket.to(PLAYERS_ID).emit('game:countdown_ending', html);
                });

            }
        
        }, 1000);
        
        socket.to(GROUP_ID).emit('game:countdown', timeLeft);
    
    }

    function CalcPlayerScore(playerId, real) {

        var points = (real === true) ? _CONFIG.voteScoreReal : _CONFIG.voteScoreGuess;

        if(playerId === realId)
            return;

        // Set total points
        if(_PLAYERS[playerId].score_total === undefined)
            _PLAYERS[playerId].score_total = points;
        else
            _PLAYERS[playerId].score_total += points;

        // Set points for this round
        _PLAYERS[playerId].score = points;

        logger.info(_PLAYERS[playerId].username + ' score is now ' + _PLAYERS[playerId].score_total);

        return points;

    }

    function StartVoting(socket) {

        // Submit random hashtags for players who did not submit!
        _.each(_.keys(_PLAYERS), function(playerId, index) {

            if(_.where(_CURRENT_SUBMISSIONS, {id: playerId})[0] === undefined)
                _CURRENT_SUBMISSIONS.push( { id: playerId, hashtag: Sentencer.make('{{noun}}'), username: _PLAYERS[playerId].username } );

        });

        // Add real hashtag
        _CURRENT_SUBMISSIONS.push( { id: realId, hashtag: _REAL_HASHTAG.replace('#', ''), real: true } );

        // Randomize the hashtag order and make sure all displayed ones for group view are unique
        var randomizedHashtags = _.shuffle(_CURRENT_SUBMISSIONS);
        var uniqueHashtags = _.uniq(randomizedHashtags, function(item, key, hashtag) { 
                                    return item.hashtag;
                             });
        var data = {
                        hashtags: uniqueHashtags, 
                        tweet: _CURRENT_TWEET
                   };
        
        Templates.Load('partials/player/voting', randomizedHashtags, function(html) {
            socket.to(PLAYERS_ID).emit('hashtags:received', html);
        });

        Templates.Load('partials/group/voting', data, function(html) {
            socket.to(GROUP_ID).emit('hashtags:received', html);

            // Begin voting countdown and assign countdown end event
            Countdown(socket);
            _EVENT_COUNTDOWN_DONE = ShowSubmissions;
        });

        // Reset vote count
        _VOTES = 0;

    }

    function ShowSubmissions(socket) {

        // Stop countdown
        clearInterval(_COUNTDOWN);

        var data = {   
                        hashtags: _CURRENT_SUBMISSIONS,
                        tweet: _CURRENT_TWEET,
                        players: _.sortBy(_PLAYERS, function(player){ return Math.sin(player.score_total); }),
                        round: _CURRENT_ROUND,
                        last_round: (_CURRENT_ROUND === _CONFIG.roundNumber-1)
                   };

        console.log('_CURRENT_ROUND', _CURRENT_ROUND)
        console.log('_CONFIG.roundNumber', _CONFIG.roundNumber-1)

        // GROUP view
        Templates.Load('partials/group/results', data, function(html) {
            socket.to(GROUP_ID).emit('hashtags:results', html);
        });

        // PLAYER view
        Templates.Load('partials/player/results', undefined, function(html) {
            socket.to(PLAYERS_ID).emit('game:round_over', html);
        });

    }

    this.Initialize = function() {
        
        var keystone = require('keystone');
        var Tweet = keystone.list('Tweet').model;
        var GameConfig = keystone.list('GameConfig').model;
    
        // Populate content buckets for this session
        Tweet.find({'category': { $in: gameSession.contentCategories}}, function(err, result) {

            // Randomize tweets
            _GAME_SESSION.tweets = shuffle(result);
            
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

        console.info(_GAME_SESSION.accessCode + 'Game "' + _GAME_SESSION.accessCode + '" started! ');
    
    }

    // Game ended
    this.End = function(socket, noTimeout) {

        if(noTimeout === undefined || !noTimeout) {

            var timeoutTime = 30;

            console.info('Game "' + _GAME_SESSION.accessCode + '" is timing out! ');

            _GAME_TIMEOUT = setInterval(function() {

                timeoutTime--;

                if(timeoutTime === 0) {

                    clearInterval(_GAME_TIMEOUT);

                    Templates.Load('partials/player/end', undefined, function(html) {
                        socket.to(PLAYERS_ID).emit('game:end', html);
                    });

                    Reset();
                    Session.Delete(PLAYERS);

                }
                else {

                    // Dispatch countdown for game timeout
                    Templates.Load('partials/player/gameending', {time: timeoutTime}, function(html) {
                        socket.to(PLAYERS_ID).emit('game:ending', html);
                    });

                }
            
            }, 1000);

        }
        else {

            Reset();
            Session.Delete(PLAYERS);

            // Dispatch countdown for game timeout
            Templates.Load('partials/player/gameended', {time: timeoutTime}, function(html) {
                socket.to(PLAYERS_ID).emit('game:ended', html);
            });


        }
        
    };

    this.AdvanceRound = function(socket) {

        // End of game?
        if(_CURRENT_ROUND === _CONFIG.roundNumber-1)
        {
            this.End(socket);
            return;
        }

        // Store and reset hashtags
        _ALL_HASHTAGS[_CURRENT_ROUND] = _CURRENT_SUBMISSIONS;
        _CURRENT_SUBMISSIONS = [];

        // Advance round and show next tweet
        _CURRENT_ROUND++;
        this.DisplayTweet(_CURRENT_ROUND, socket);

    };

    this.ModeratorJoin = function(socket) {

        clearInterval(_GAME_TIMEOUT);

        // Inform players of resumed game (if applicable)
        socket.to(PLAYERS_ID).emit('game:resumed');

    };

    this.PlayerReady = function(player, socket) {

        _PLAYERS[player.id] = { username: player.username, index: currentPlayerIndex, submitted: false };

        console.info(player.username + ' has joined the game.');

        currentPlayerIndex++;

        socket.to(GROUP_ID).emit('players:update', _PLAYERS);

    };

    this.PlayerLost = function(player, socket) {

        if(_PLAYERS[player] === undefined)
            return;

        console.info(_PLAYERS[player].username + ' has left the game.');

        delete _PLAYERS[player];

        socket.to(GROUP_ID).emit('players:update', _PLAYERS);

        // Decrease current # of players
        currentPlayerCap = Object.keys(_PLAYERS).length;

        if(Object.keys(_PLAYERS).length === 0)
            Reset();

    };

    this.StartGame = function(socket) {

        // First round
        _CURRENT_ROUND = 0;

        // Get current # of players
        currentPlayerCap = Object.keys(_PLAYERS).length;

        this.DisplayTweet(_CURRENT_ROUND, socket);

    };

    this.DisplayTweet = function(tweetIndex, socket) {

        var data = _GAME_SESSION.tweets[tweetIndex];

        if(data === undefined)
        {
            // No tweets left, end game
            console.warn('Tweet data for round is undefined! Ending game.');
            this.End(socket, true);
            return;
        }

        // Cache the real hashtag and tweet
        _REAL_HASHTAG = data.hashtag.toLowerCase().replace('#', '');
        _CURRENT_TWEET = data.tweetText;

        data.players = _PLAYERS;

        Templates.Load('partials/player/tweet', data, function(html) {
          socket.to(PLAYERS_ID).emit('game:start', html);
        });

        Templates.Load('partials/group/tweet', data, function(html) {
            
            socket.to(GROUP_ID).emit('game:start', html);
        
            // Begin first countdown and assign end event
            Countdown(socket);
            _EVENT_COUNTDOWN_DONE = StartVoting;

        });

    }

    this.HashtagSubmitted = function(player, submission, socket, space) {

        // If player has submitted the real hashtag, ask them to try again
        if(submission === undefined || submission.length === 0) {
            socket.emit('hashtag:tryagain', 'You need to submit a hashtag!');
            return;
        }

        // All hashtags should be lower case and not include #
        var thisHashtag = submission.toLowerCase().replace('#', '');
        
        // If player has submitted the real hashtag, ask them to try again
        var realMatch = new RegExp("\\b" + _REAL_HASHTAG + "\\b").test(thisHashtag);
        if(realMatch) {
            socket.emit('hashtag:tryagain', 'You guessed the actual hashtag! Please try again.');
            return;
        }

        _CURRENT_SUBMISSIONS.push( { id: player, hashtag: thisHashtag, user: _PLAYERS[player] } );
        _PLAYERS[player].submitted = true;

        socket.emit('hashtag:success');

        console.log(_PLAYERS[player].username + ' submitted hashtag "' + thisHashtag + '".');
        console.info(_CURRENT_SUBMISSIONS.length + ' players out of ' + currentPlayerCap + ' have submitted.');

        // All hashtags received; voting begins
        if(_CURRENT_SUBMISSIONS.length === currentPlayerCap)
            StartVoting(space);

    };

    this.HashtagVote = function(playerId, submitterId, socket) {

        var thisHashtag = _.where(_CURRENT_SUBMISSIONS, {id: submitterId})[0];
        var voteScore = 0;

        // Calculate score for voter if real hashtag, or for submitter if theirs was guessed
        if(thisHashtag.real)
            voteScore = CalcPlayerScore(playerId, true); 
        else
            voteScore = CalcPlayerScore(submitterId, false); 

        // Save vote for hashtag
        if(thisHashtag.votes === undefined) {

            thisHashtag.votes = [ { 
                                    user: _PLAYERS[playerId],
                                    score: voteScore
                                } ];

        }
        else {

            thisHashtag.votes.push( { 
                                    user: _PLAYERS[playerId],
                                    score: voteScore
                                  } );

        }

        _VOTES++;

        console.log(_PLAYERS[playerId].username + ' voted for "' + thisHashtag + '".');
        console.info(_VOTES + ' players out of ' + currentPlayerCap + ' have voted.');

        // All votes are in, show results
        // logger.info('HashtagVote', _VOTES + ' --- ' + _GAME_SESSION.playerCap)
        if(_VOTES >= currentPlayerCap)
            ShowSubmissions(socket);

    };

    // Is username a player entered available?
    this.UsernameAvailable = function(name) {

        return (_.where(_PLAYERS, {username: name}).length === 0);

    };

    // Is game full of players?
    this.IsFull = function() {

        return (Object.keys(_PLAYERS).length === 8)

    };


};