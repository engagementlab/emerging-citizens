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
        _CURRENT_SUBMISSIONS = {},
        _PLAYERS_SUBMITTED = [],
        randomizedHashtags,
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

    // Stores last event sent and its data
    var lastTemplate;
    var lastEventId;

    // Identify targets for socket events
    var PLAYERS_ID = _GAME_SESSION.accessCode,
        GROUP_ID = _GAME_SESSION.accessCode + '-group';

    function GetPlayerById(id) {
        return _.findWhere(_PLAYERS, {socket_id: id});
    }

    function Reset() {

        // Stop countdown
        clearInterval(_COUNTDOWN);
        _COUNTDOWN = undefined;

        _PLAYERS = {};
        _CURRENT_SUBMISSIONS = {};
        _PLAYERS_SUBMITTED = [];

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
          
                    lastTemplate = html;
                    lastEventId = 'game:countdown_ending';
                });

            }
        
        }, 1000);
        
        socket.to(GROUP_ID).emit('game:countdown', timeLeft);
    
    }

    function CalcPlayerScore(currentPlayer, real) {

        var points = (real === true) ? _CONFIG.voteScoreReal : _CONFIG.voteScoreGuess;

        if(currentPlayer.socket_id === realId) 
            return;
        
        // Set points for this round
        if (currentPlayer.score === undefined)
            currentPlayer.score = points;
        else
            currentPlayer.score += points;
        
        // Set total points
        if(currentPlayer.score_total === undefined)
            currentPlayer.score_total = points;
        else
            currentPlayer.score_total += points;

        logger.info(currentPlayer.username + ' points this round are ' + currentPlayer.score);

        logger.info(currentPlayer.username + ' score is now ' + currentPlayer.score_total);

        return points;

    }

    function StartVoting(socket) {

        // Submit random hashtags for players who did not submit!
        _.each(_PLAYERS, function(player, ind) {

            // Is player not in array of those who submitted?
            if (!_.contains(_PLAYERS_SUBMITTED, player)) {
                
                var randomHashtag = Sentencer.make('{{noun}}');
                
                _CURRENT_SUBMISSIONS[randomHashtag] = {};
                _CURRENT_SUBMISSIONS[randomHashtag].submitters = [ player ];

            }  
        
        });

        // Add real hashtag
        var realHashtag = _REAL_HASHTAG.replace('#', '');
        _CURRENT_SUBMISSIONS[realHashtag] = {};
        _CURRENT_SUBMISSIONS[realHashtag].submitters = [{ socket_id: realId, real: true }];

        // Randomize the hashtag order and make sure all displayed ones for group view are unique
        randomizedHashtags = _.shuffle(Object.keys(_CURRENT_SUBMISSIONS));

        var data = {
                        hashtags: randomizedHashtags, 
                        tweet: _CURRENT_TWEET
                   };
        
        Templates.Load('partials/player/voting', randomizedHashtags, function(html) {
            socket.to(PLAYERS_ID).emit('hashtags:received', html);
          
            lastTemplate = html;
            lastEventId = 'hashtags:received';
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

        _.each(_CURRENT_SUBMISSIONS, function(hashtag, index) {
            hashtag['votes'] = _.uniq(hashtag['votes'], 'user');
        });

        _.each(_PLAYERS, function(player) {
            if (player.score_total === undefined) 
                player.score_total = 0;
        });
        
        var lastRound = (_CURRENT_ROUND === _CONFIG.roundNumber-1);
        var sortedPlayers = _.sortBy(_PLAYERS, function(player) {return player.score_total}).reverse();
        
        var data = {    
                        hashtags: _CURRENT_SUBMISSIONS,
                        tweet: _CURRENT_TWEET,
                        players: sortedPlayers,
                        round: _CURRENT_ROUND,
                        last_round: lastRound
                   };
        
        // GROUP view
        Templates.Load('partials/group/results', data, function(html) {
            socket.to(GROUP_ID).emit('hashtags:results', html);
        });

        // PLAYER view
        Templates.Load('partials/player/results', { last_round: lastRound }, function(html) {
            socket.to(PLAYERS_ID).emit('game:round_over', html);
          
            lastTemplate = html;
            lastEventId = 'game:round_over';
        });

    }

    this.Initialize = function() {
        
        var keystone = require('keystone');
        var Tweet = keystone.list('Tweet').model;
        var GameConfig = keystone.list('GameConfig').model;
    
        // Populate content buckets for this session
        Tweet.find({'category': { $in: gameSession.contentCategories}}, function(err, result) {

            // Randomize tweets
            var tweets = shuffle(result);
            
            // Save tweet IDs to the model's 'tweets' key and then cache all tweet data for this session
            _GAME_SESSION.tweets = tweets;
            _ALL_TWEETS = tweets;
            
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
                        
                    Reset();
                    Session.Delete(PLAYERS_ID);

                    Templates.Load('partials/player/gameended', undefined, function(html) {
                        socket.to(PLAYERS_ID).emit('game:ended', html);
          
                        lastTemplate = html;
                        lastEventId = 'game:ended';
                    });


                }
                else {

                    // Dispatch countdown for game timeout
                    Templates.Load('partials/player/gameending', {time: timeoutTime}, function(html) {
                        socket.to(PLAYERS_ID).emit('game:ending', html);
          
                        lastTemplate = html;
                        lastEventId = 'game:ending';
                    });

                }
            
            }, 1000);

        }
        else {

            Reset();
            Session.Delete(PLAYERS_ID);

            // Dispatch countdown for game timeout
            Templates.Load('partials/player/gameended', {time: timeoutTime}, function(html) {
                socket.to(PLAYERS_ID).emit('game:ended', html);
          
                lastTemplate = html;
                lastEventId = 'game:ended';
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
        _CURRENT_SUBMISSIONS = {};
        _PLAYERS_SUBMITTED = [];
        
        _.each(_PLAYERS, function(playerId, index) {

            _PLAYERS[index] = _.omit(_PLAYERS[index], 'score');
            _PLAYERS[index].submitted = false;
        
        });

        // Save session progress to DB
        _GAME_SESSION.submissions = _ALL_HASHTAGS;

        console.log('_GAME_SESSION', _GAME_SESSION)
        Session.Save(_GAME_SESSION);

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

        // If player is re-connecting, set them back to connected, and re-broadcast the last update
        if(_PLAYERS[player.uid] !== undefined)
        {
            _PLAYERS[player.uid].connected = true;
            _PLAYERS[player.uid].socket_id = player.socket_id;

            console.info(player.username + ' has re-joined the game and has uid ' + player.uid); 

            socket.emit(lastEventId, lastTemplate);
        }
        else {

            _PLAYERS[player.uid] = { 
                                        username: player.username, 
                                        socket_id: player.socket_id, 
                                        index: currentPlayerIndex, 
                                        submitted: false, 
                                        connected: true
                                    };

            console.info(player.username + ' has joined the game and has uid ' + player.uid);

            currentPlayerIndex++;

            socket.to(GROUP_ID).emit('players:update', _PLAYERS);

        }

    };

    this.PlayerLost = function(playerSocketId, socket) {

        var thisPlayer = GetPlayerById(playerSocketId)

        if(thisPlayer === undefined)
            return;

        thisPlayer.connected = false;

        console.info(thisPlayer.username + ' has left the game. Waiting for re-join.');

        setTimeout(function () {
            if (!thisPlayer.connected) {

                delete thisPlayer;

                socket.to(GROUP_ID).emit('players:update', _PLAYERS);

                // Decrease current # of players
                currentPlayerCap = Object.keys(_PLAYERS).length;

                if(Object.keys(_PLAYERS).length === 0)
                    Reset();

            }
        }, 15000);

    };

    /**
     * Begin the game's tutorial.
     *
     * @class lib/Hashtag
     */
    this.StartTutorial = function(socket) {

        Templates.Load('partials/group/tutorial', undefined, function(html) {
            
            socket.to(GROUP_ID).emit('game:tutorial', html);
        
        });

    };

    this.StartGame = function(socket) {

        // First round
        _CURRENT_ROUND = 0;

        // Get current # of players
        currentPlayerCap = Object.keys(_PLAYERS).length;

        this.DisplayTweet(_CURRENT_ROUND, socket);

    };

    this.DisplayTweet = function(tweetIndex, socket) {

        var data = _ALL_TWEETS[tweetIndex];
        var playerCount = Object.keys(_PLAYERS).length;

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

        data.players = { 
                         left: _.first(_.values(_PLAYERS), playerCount/2), 
                         right: _.rest(_.values(_PLAYERS), playerCount/2) 
                       };

        Templates.Load('partials/player/tweet', data, function(html) {

          socket.to(PLAYERS_ID).emit('game:start', html);

          lastTemplate = html;
          lastEventId = 'game:start';

        });

        Templates.Load('partials/group/tweet', data, function(html) {
            
            socket.to(GROUP_ID).emit('game:start', html);
        
            // Begin first countdown and assign end event
            Countdown(socket);
            _EVENT_COUNTDOWN_DONE = StartVoting;

        });

    };

    this.HashtagSubmitted = function(playerSocketId, submission, socket, space) {

        // If player has submitted the real hashtag, ask them to try again
        if(submission === undefined || submission.length === 0) {
            socket.emit('hashtag:tryagain', 'You need to submit a hashtag!');
            return;
        }

        // All hashtags should be lower case and not include #
        var thisHashtag = submission.toLowerCase().replace('#', '');

        var thisPlayer = GetPlayerById(playerSocketId);

        if(thisPlayer === undefined)
            throw new Error("Player with socket_id '" + playerSocketId + "' NOT found!");
        
        // If player has submitted the real hashtag, ask them to try again
        var realMatch = new RegExp("\\b" + _REAL_HASHTAG + "\\b").test(thisHashtag);
        if(realMatch) {
            socket.emit('hashtag:tryagain', 'You guessed the actual hashtag! Please try again.');
            return;
        }
        // If duplicate hashtag, add to that hashtag array in _CURRENT_SUBMISSIONS.submitters object
        if (_.has(_CURRENT_SUBMISSIONS, thisHashtag))
            _CURRENT_SUBMISSIONS[thisHashtag].submitters.push( thisPlayer );
        
        else {
            _CURRENT_SUBMISSIONS[thisHashtag] = {};
            _CURRENT_SUBMISSIONS[thisHashtag].submitters = [thisPlayer];
        }
        
        thisPlayer.submitted = true;

        socket.emit('hashtag:success', thisHashtag);

        console.log(thisPlayer.username + ' submitted hashtag "' + thisHashtag + '".');

        _PLAYERS_SUBMITTED.push( thisPlayer );

        console.log(_PLAYERS_SUBMITTED.length + ' players out of ' + currentPlayerCap + ' have submitted.');

        // All hashtags received; voting begins
        if(_PLAYERS_SUBMITTED.length === currentPlayerCap)
            StartVoting(space);

    };

    this.HashtagVote = function(playerId, hashtag, socket) {

        var submitterId = [];
        var thisSubmission = _CURRENT_SUBMISSIONS[hashtag];
        var thisPlayer = GetPlayerById(playerId);
        var voteScore = 0;

        for (var submitter of thisSubmission.submitters) {

            // Calculate score for voter if real hashtag, or for submitter if theirs was guessed
            if(submitter.real) {
                console.log('thisPlayer', thisPlayer)
                voteScore = CalcPlayerScore(thisPlayer, true); 
                console.log ("real hashtag points " + voteScore);
            }
            else {
                console.log('submitter', GetPlayerById(submitter.socket_id))
                voteScore = CalcPlayerScore(GetPlayerById(submitter.socket_id), false);
                console.log ("voted for points " + voteScore);

            }

            // Save vote for hashtag
            if(thisSubmission.votes === undefined) {

                thisSubmission.votes = [ { 
                                            user: thisPlayer,
                                            score: voteScore
                                       } ];

            }
            else {

                thisSubmission.votes.push( { 
                                            user: thisPlayer,
                                            score: voteScore
                                          } );

            }
        }
        
        _VOTES++;

        console.log(thisPlayer.username + ' voted for "' + hashtag + '".');
        
        console.info(_VOTES + ' players out of ' + currentPlayerCap + ' have voted.');

        // All votes are in, show results
        if(_VOTES >= currentPlayerCap)
            ShowSubmissions(socket);

    };

    // Is username a player entered available?
    this.UsernameAvailable = function(name) {

        return (_.where(_PLAYERS, {username: name}).length === 0);

    };

    // Is user whose UID is provided still active?
    this.PlayerIsActive = function(uid) {

        return _PLAYERS[uid] !== undefined;

    };

    // Is game full of players?
    this.IsFull = function() {

        return (Object.keys(_PLAYERS).length === 8)

    };


};