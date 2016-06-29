'use strict';

/**
 * Emerging Citizens
 * Developed by Engagement Lab, 2016
 * ==============
 * Common functionality game controller
 *
 * @class lib/games
 * @static
 * @author Johnny Richardson
 *
 * ==========
 */

class Common {

    constructor() {

        this.Templates = require('../TemplateLoader'),
        this.Session = require('../SessionManager'),

        this._currentPlayers = {},
        this._currentPlayerIndex = 0,
        this._game_session,
        this._game_timeout,
        this._config = {},

        this._currentSubmissions = {},
        this._players_submitted = [],

        this._countdown,
        this._event_countdown_done,

        // Stores last event sent and its data
        this._objLastTemplate,
        this._strLastEventId,

        this.currentPlayerCap,

        // Identifies targets for socket events
        this.players_id,
        this.group_id,
        this.keystone = require('keystone');

    }

    GetPlayerById(id) {

        return _.findWhere(this._currentPlayers, {socket_id: id});
    
    }

    // Is username a player entered available?
    UsernameAvailable(name) {

        return (_.where(this._currentPlayers, {username: name}).length === 0);

    }

    // Is user whose UID is provided still active?
    PlayerIsActive(uid) {

        return this._currentPlayers[uid] !== undefined;

    }

    // Is game full of players?
    IsFull() {

        return (Object.keys(this._currentPlayers).length === 8)

    }

    Initialize(gameSession) {

        var GameConfig = this.keystone.list('GameConfig').model;

        // Init session
        this._game_session = gameSession;

        // Identify targets for socket events
        this.players_id = gameSession.accessCode,
        this.group_id = gameSession.accessCode + '-group';

        // Get config for HTYI game
        var queryConfig = GameConfig.findOne({}, {}, {
            sort: {
                'createdAt': -1
            }
        });
        queryConfig.exec(function(err, resultConfig) {

            this._config = resultConfig;

        });

        console.info(gameSession.accessCode + 'Game "' + gameSession.accessCode + '" started! ');
        
    }

    Reset() {

        // Stop countdown
        clearInterval(this._COUNTDOWN);
        this._countdown = undefined;

        this._currentPlayers = {};
        this._current_submissions = {};
        this._players_submitted = [];

        this._currentPlayerIndex = 0;

        console.info('Game "' + this._game_session.accessCode + '" ended! ');

    }

    /**
     * Begin the game's tutorial.
     *
     * @class lib/games/Common
     */
    StartTutorial(socket) {

        this.Templates.Load('partials/group/tutorial', undefined, (html) => {
            
            socket.to(this.group_id).emit('game:tutorial', html);
        
        });

    }

    Countdown(socket) {

        if(this._countdown !== undefined) 
            clearInterval(this._countdown);

        // Mins * 60 to get seconds
        var timeLeft = this._config.timeLimit * 60;
        this._countdown = setInterval(() => {

            timeLeft--;

            if(timeLeft === 0) {

                clearInterval(this._countdown);
                _event_countdown_done(socket);

            }
            else if(timeLeft === 30) {

                // Dispatch countdown when running out of time for player
                this.Templates.Load('partials/player/timerunningout', undefined, (html) => {
                    socket.to(this.players_id).emit('game:countdown_ending', html);
          
                    this._objLastTemplate = html;
                    this._strLastEventId = 'game:countdown_ending';
                });

            }
        
        }, 1000);
        
        socket.to(this.group_id).emit('game:countdown', timeLeft);
    
    }

    StopCountdown() {

        clearInterval(this._countdown);
    
    }

    ModeratorJoin(socket) {

        clearInterval(this._game_timeout);

        // Inform players of resumed game (if applicable)
        socket.to(this.PLAYERS_ID).emit('game:resumed');

    }

    // Game ended
    End(socket, noTimeout) {

        if(noTimeout === undefined || !noTimeout) {

            var timeoutTime = 30;

            console.info('Game "' + this._game_session.accessCode + '" is timing out! ');

            this._game_timeout = setInterval(() => {

                timeoutTime--;

                if(timeoutTime === 0) {

                    clearInterval(this._game_timeout);
                        
                    Reset();
                    Session.Delete(this.players_id);

                    Templates.Load('partials/player/gameended', undefined, (html) => {
                        socket.to(this.players_id).emit('game:ended', html);
          
                        lastTemplate = html;
                        lastEventId = 'game:ended';
                    });


                }
                else {

                    // Dispatch countdown for game timeout
                    Templates.Load('partials/player/gameending', {time: timeoutTime}, (html) => {
                        socket.to(this.players_id).emit('game:ending', html);
          
                        lastTemplate = html;
                        lastEventId = 'game:ending';
                    });

                }
            
            }, 1000);

        }
        else {

            this.Reset();
            this.Session.Delete(this.players_id);

            // Dispatch countdown for game timeout
            Templates.Load('partials/player/gameended', {time: timeoutTime}, (html) => {
                socket.to(this.players_id).emit('game:ended', html);
          
                this._objLastTemplate = html;
                this._strLastEventId = 'game:ended';
            });


        }

    }

    PlayerReady(player, socket) {

        // If player is re-connecting, set them back to connected, and re-broadcast the last update
        if(this._currentPlayers[player.uid] !== undefined)
        {
            this._currentPlayers[player.uid].connected = true;
            this._currentPlayers[player.uid].socket_id = player.socket_id;

            console.info(player.username + ' has re-joined the game and has uid ' + player.uid); 

            socket.emit(this._strLastEventId, this._objLastTemplate);
        }
        else {

            this._currentPlayers[player.uid] = {
                                        username: player.username, 
                                        socket_id: player.socket_id, 
                                        index: this.currentPlayerIndex, 
                                        submitted: false, 
                                        connected: true
                                    };

            console.info(player.username + ' has joined the game and has uid ' + player.uid);

            this.currentPlayerIndex++;

            socket.to(this.group_id).emit('players:update', this._currentPlayers);

        }

    }

    PlayerLost(playerSocketId, socket) {

        var thisPlayer = GetPlayerById(playerSocketId)

        if(thisPlayer === undefined)
            return;

        thisPlayer.connected = false;

        console.info(thisPlayer.username + ' has left the game. Waiting for re-join.');

        setTimeout(() => {
            if (!thisPlayer.connected) {

                delete this._currentPlayers[thisPlayer.uid];

                socket.to(this.group_id).emit('players:update', this._currentPlayers);

                // Decrease current # of players
                this._currentPlayerCap = Object.keys(this._currentPlayers).length;

                if(Object.keys(this._currentPlayers).length === 0)
                    Reset();

            }
        }, 15000);

    }

    AdvanceRound(socket) {

        // End of game?
        if(this._current_round === this._config.roundNumber-1)
        {
            this.End(socket);
            return;
        }

        this._currentSubmissions = {};
        
        _.each(this._players_submitted, function(playerId, index) {

            this._players_submitted[index] = _.omit(this._players_submitted[index], 'score');
            this._players_submitted[index].submitted = false;
        
        });

        // Save session progress to DB
        this._game_session.submissions = this._all_hashtags;

        this.SaveSession();

        // Advance round and show next tweet
        this._current_round++;

    }

    SaveState(strEventId, objTemplate) {

        this._strLastEventId = strEventId;
        this._objLastTemplate = objTemplate;

    }

    SaveSession() {

        this.Session.Save(this._game_session);

    }

}

module.exports = Common;