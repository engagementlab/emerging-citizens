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

    var _ALL_HASHTAGS = {};

    // ID to indentify "real" hashtag
    var realId = randomstring.generate();
    var currentPlayerCap;
    var currentPlayerIndex = 0;

    function Reset() {

        // Stop countdown
        clearInterval(_COUNTDOWN);
        _COUNTDOWN = undefined;

        _PLAYERS = {};
        _CURRENT_SUBMISSIONS = [];

        currentPlayerIndex = 0;

        console.re.info('Game "' + _GAME_SESSION.accessCode + '" ended! ');

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
                    socket.to(_GAME_SESSION.accessCode).emit('game:countdown_ending', html);
                });

            }
        
        }, 1000);
        
        socket.to(_GAME_SESSION.accessCode + '-moderator').emit('game:countdown', timeLeft);
    
    }

    function CalcPlayerScore(playerId, real) {

        var points = (real === true) ? _CONFIG.voteScoreReal : _CONFIG.voteScoreGuess;

        if(playerId === realId)
            return;

        if(_PLAYERS[playerId].score_total === undefined)
            _PLAYERS[playerId].score_total = points;
        else
            _PLAYERS[playerId].score_total += points;

        logger.info(_PLAYERS[playerId].username + ' score is now ' + _PLAYERS[playerId].score_total);

        return _PLAYERS[playerId].score_total;

    }

    function StartVoting(socket) {

        // Submit random hashtags for players who did not submit!
        _.each(_.keys(_PLAYERS), function(playerId, index) {

            if(_.where(_CURRENT_SUBMISSIONS, {id: playerId})[0] === undefined)
                _CURRENT_SUBMISSIONS.push( { id: playerId, hashtag: Sentencer.make('{{noun}}'), username: _PLAYERS[playerId].username } );

        });

        // Add real hashtag
        _CURRENT_SUBMISSIONS.push( { id: realId, hashtag: _REAL_HASHTAG.replace('#', ''), real: true } );

        // Randomize the hashtag order and make sure all displayed ones are unique
        var randomizedHashtags = _.shuffle(_CURRENT_SUBMISSIONS);
        randomizedHashtags = _.uniq(randomizedHashtags, function(item, key, hashtag) { 
                                    return item.hashtag;
                             });
        var data = {
                        hashtags: randomizedHashtags, 
                        tweet: _CURRENT_TWEET
                   };
        
        Templates.Load('partials/player/voting', randomizedHashtags, function(html) {
            socket.to(_GAME_SESSION.accessCode).emit('hashtags:received', html);
        });

        Templates.Load('partials/moderator/voting', data, function(html) {
            socket.to(_GAME_SESSION.accessCode + '-moderator').emit('hashtags:received', html);

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

        // Hashtags are spliced into two arrays for column layoutx

        // _CURRENT_HASHTAGS.splice(0, (_CURRENT_HASHTAGS.length - 1) / 2);
        // console.log (_CURRENT_HASHTAGS);

        var data = {   
                        hashtags: _CURRENT_SUBMISSIONS,
                        tweet: _CURRENT_TWEET,
                        players: _.sortBy(_PLAYERS, function(player){ return Math.sin(player.score_total); })
                   };

        Templates.Load('partials/moderator/results', data, function(html) {
            socket.to(_GAME_SESSION.accessCode + '-moderator').emit('hashtags:reveal', html);
        });

        Templates.Load('partials/player/results', undefined, function(html) {
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

        console.re.info(_GAME_SESSION.accessCode + 'Game "' + _GAME_SESSION.accessCode + '" started! ');
    
    }

    // Game ended
    this.End = function(socket) {

        /*Templates.Load('partials/'moderator/end', undefined, function(html) {
            
            socket.to(_GAME_SESSION.accessCode + '-moderator').emit('game:end', html);

        });*/

        var timeoutTime = 30;

        console.re.info('Game "' + _GAME_SESSION.accessCode + '" is timing out! ');

        _GAME_TIMEOUT = setInterval(function() {

            timeoutTime--;

            if(timeoutTime === 0) {

                clearInterval(_GAME_TIMEOUT);

                Templates.Load('partials/player/end', undefined, function(html) {
                    socket.to(_GAME_SESSION.accessCode).emit('game:end', html);
                });

                Reset();
                Session.Delete(_GAME_SESSION.accessCode);

            }
            else {

                // Dispatch countdown for game timeout
                Templates.Load('partials/player/gameending', {time: timeoutTime}, function(html) {
                    socket.to(_GAME_SESSION.accessCode).emit('game:ending', html);
                });

            }
        
        }, 1000);
        
    };

    this.AdvanceRound = function(socket) {

        // End of game?
        if(_CURRENT_ROUND === _GAME_SESSION.tweets.length-1)
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
        socket.to(_GAME_SESSION.accessCode).emit('game:resumed');

    };

    this.PlayerReady = function(player, socket) {

        _PLAYERS[player.id] = { username: player.username, index: currentPlayerIndex, submitted: false };

        console.re.info(player.username + ' has joined the game.');

        currentPlayerIndex++;

        socket.to(_GAME_SESSION.accessCode + '-moderator').emit('players:update', _PLAYERS);

    };

    this.PlayerLost = function(player, socket) {

        console.re.info(_PLAYERS[player].username + ' has left the game.');

        delete _PLAYERS[player];

        socket.to(_GAME_SESSION.accessCode + '-moderator').emit('players:update', _PLAYERS);

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
            throw new Error('Tweet data for session is undefined!');

        // Cache the real hashtag and tweet
        _REAL_HASHTAG = data.hashtag.toLowerCase().replace('#', '');
        _CURRENT_TWEET = data.tweetText;

        data.players = _PLAYERS;

        Templates.Load('partials/player/tweet', data, function(html) {
          socket.to(_GAME_SESSION.accessCode).emit('game:start', html);
        });

        Templates.Load('partials/moderator/tweet', data, function(html) {
            
            socket.to(_GAME_SESSION.accessCode + '-moderator').emit('game:start', html);
        
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
        if(thisHashtag == _REAL_HASHTAG) {
            socket.emit('hashtag:tryagain', 'You guessed the actual hashtag! Please try again.');
            return;
        }

        _CURRENT_SUBMISSIONS.push( { id: player, hashtag: thisHashtag, username: _PLAYERS[player].username } );
        _PLAYERS[player].submitted = true;

        socket.emit('hashtag:success');

        console.re.log(_PLAYERS[player].username + ' submitted hashtag "' + thisHashtag + '".');
        console.re.info(_CURRENT_SUBMISSIONS.length + ' players out of ' + currentPlayerCap + ' have submitted.');

        // All hashtags received; voting begins
        if(_CURRENT_SUBMISSIONS.length === currentPlayerCap)
            StartVoting(space);

    };

    this.HashtagVote = function(playerId, submitterId, socket) {

        var thisHashtag = _.where(_CURRENT_SUBMISSIONS, {id: submitterId})[0];

        // Save vote for hashtag
        if(thisHashtag.votes === undefined) {

            thisHashtag.votes = [ { 
                                    username: _PLAYERS[playerId].username
                                } ];

        }
        else {

            thisHashtag.votes.push( { 
                                    username: _PLAYERS[playerId].username,
                                  } );

        }

        console.re.log(_PLAYERS[playerId].username + ' voted for "' + thisHashtag + '".');
        console.re.info(_VOTES + ' players out of ' + currentPlayerCap + ' have voted.');

        // Calculate score for voter if real hashtag, or for submitter if theirs was guessed
        if(thisHashtag.real)
            CalcPlayerScore(playerId, true); 
        else
            CalcPlayerScore(submitterId, false); 

        _VOTES++;

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