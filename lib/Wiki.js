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

    // Links = keystone.list('WikiLinks'),

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
        _GAME_TIMEOUT,
        _GAME_SESSION = gameSession,
        _PLAYERS = {},
        _VOTES = 0,
        _CONFIG = {},
        _REAL_HASHTAG;

    var _ALL_ARTICLES = {},
        _ALL_STEPS;

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


	this.Initialize = function() {
        
        var keystone = require('keystone');
        var Links = keystone.list('WikiLinks').model;
        var GameConfig = keystone.list('GameConfig').model;


    
        // Populate content buckets for this session
        Links.find({'category': { $in: gameSession.contentCategories}}, function(err, result) {

        	var roundlimit = _CONFIG.roundNumber;
            // Randomize topics
            var topics = shuffle(result);

            topics = _.sample(topics, roundlimit);
            console.log (JSON.stringify(topics) + " ...shuffled topics");

            _.each (topics, function() {
            	topic = this.topic;
            	_ALL_ARTICLES[this.topic] = _.shuffle(this.destinationLinks)[0];
            });
            

            console.log (JSON.stringify(_ALL_ARTICLES) + " ...all articles");
            
            // Save link IDs to the model's 'links' key and then cache all link data for this session
            _GAME_SESSION[topics] = _ALL_ARTICLES;
            // _ALL_LINKS = links;
            
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

        console.info('Game "' + _GAME_SESSION.accessCode + '" started!');
    
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

        this.DisplayTopic(_CURRENT_ROUND, socket);

    };

    this.DisplayTopic = function(linkIndex, socket) {

        var data = _ALL_LINKS[linkIndex];
        var playerCount = Object.keys(_PLAYERS).length;

        if(data === undefined)
        {
            // No tweets left, end game
            console.warn('Topic link data for round is undefined! Ending game.');
            this.End(socket, true);
            return;
        }
        // var i = 
        // Cache the real hashtag and tweet
        _TOPIC = data.category;
        _DESTINATION_LINK = _.shuffle(data.destinationLinks)[0];

        data.players = { 
                         left: _.first(_.values(_PLAYERS), playerCount/2), 
                         right: _.rest(_.values(_PLAYERS), playerCount/2) 
                       };

        Templates.Load('partials/player/article', data, function(html) {

          socket.to(PLAYERS_ID).emit('game:start', html);

          lastTemplate = html;
          lastEventId = 'game:start';

        });

        Templates.Load('partials/group/article', data, function(html) {
            
            socket.to(GROUP_ID).emit('game:start', html);
        
            // Begin first countdown and assign end event
            Countdown(socket);
            _EVENT_COUNTDOWN_DONE = StartVoting;

        });

    };

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


}