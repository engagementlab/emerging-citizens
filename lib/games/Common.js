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

        this.Templates,
        this.Session = require('../SessionManager'),
        this.events = require('events'),
        this.eventEmitter = new this.events.EventEmitter(),

        this._current_players = {},
        this._currentPlayerIndex = 0,
        this._game_session,
        this._game_timeout,
        this._config = {},

        this._current_submissions = {},
        this._players_submitted = [],

        this._countdown,
        this._countdown_duration,
        this._countdown_paused,
        this._event_countdown_done,
        this._current_round,

        // Stores last event sent and its data
        this._objLastTemplate,
        this._strLastEventId,

        this.currentPlayerCap,

        // Identifies targets for socket events
        this.players_id,
        this.group_id,
        this.keystone = require('keystone');

    }

    Initialize(gameSession, callback) {

        var GameConfig = this.keystone.list('GameConfig').model;

        this._countdown_paused = false;

        // Init session
        this._game_session = gameSession;

        // Init template loader with current game type
        var TemplateLoader = require('../TemplateLoader');
        this.Templates = new TemplateLoader(gameSession.gameType);

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

            // console.log (this._config, "common config");
            callback(this._config);
        });

        console.info('Game "' + gameSession.accessCode + '" started! ');
        
        
    }

    GetGameType() {

        return this._game_session.gameType;

    }

    GetPlayerById(id) {
        
        let player = _.findWhere(this._current_players, {socket_id: id});

        if(!player) {
            console.log('Could not find player with socket id %s', id);
            return null;
        }

        return player;
    
    }

    GetGameType() {

        return this._game_session.gameType;

    }

    // Is username a player entered available?
    UsernameAvailable(name) {

        return (_.where(this._current_players, {username: name}).length === 0);

    }

    // Is user whose UID is provided still active?
    PlayerIsActive(uid) {

        return this._current_players[uid] !== undefined;

    }

    // Is game full of players?
    IsFull() {

        return (Object.keys(this._current_players).length === 8)

    }

    Reset() {

        // Stop countdown
        clearInterval(this._countdown);
        this._countdown = undefined;
        this._countdown_paused = false;

        this._current_players = {};
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

    Countdown(socket, data) {

        console.log ("countdown called");

        if(this._countdown !== undefined) {
            console.log ("clearing interval");
            clearInterval(this._countdown);
        }

        // Use provided time limit if provided
        if(data && data.timeLimit)
            this._countdown_duration = data.timeLimit;
        else {
            if (this._game_session.gameType === "wikigeeks")
                this._countdown_duration = this._config.timeLimitWiki;
            
            else if (this._game_session.gameType === "htyi")
                this._countdown_duration = this._config.timeLimitHashtag;          
        }

        // Start countdown
        this._countdown = setInterval(() => {

            if(this._countdown_paused)
                return;
 
            this._countdown_duration--;
            console.log (this._countdown_duration, "duration remaining");

            if(this._countdown_duration === 0) {

                this.eventEmitter.emit ('countdownEnded', data, socket);
                this.StopCountdown();
                
            }

            // TODO: This needs to be its own timeout given use of this method for a lot of game events
            else if(this._countdown_duration === 30) {

                // Dispatch countdown when running out of time for player
                this.Templates.Load('partials/player/timerunningout', undefined, (html) => {
                    socket.to(this.players_id).emit('game:countdown_ending', html);
          
                    this._objLastTemplate = html;
                    this._strLastEventId = 'game:countdown_ending';
                });

            }
        
        }, 1000);
        
        // Dispatch time to group view
        let socketInfo = {duration: this._countdown_duration}
        
        if(data && data.countdownName)
            socketInfo.name = data.countdownName;
        
        console.log (socketInfo);
        socket.to(this.group_id).emit('game:countdown', socketInfo);
    
    }

    PauseResumeCooldown(socket) {

        if(process.env.NODE_ENV === 'production')
            return;

        this._countdown_paused = !this._countdown_paused;
        socket.to(this.group_id).emit('debug:pause');

    }

    StopCountdown() {

        console.log ("StopCountdown");

        clearInterval(this._countdown);
                
        this.eventEmitter.removeAllListeners('countdownEnded');
    
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
                        
                    this.Reset();
                    Session.Delete(this.players_id);

                    this.Templates.Load('partials/player/gameended', undefined, (html) => {
                        socket.to(this.players_id).emit('game:ended', html);
          
                        lastTemplate = html;
                        lastEventId = 'game:ended';
                    });


                }
                else {

                    // Dispatch countdown for game timeout
                    this.Templates.Load('partials/player/gameending', {time: timeoutTime}, (html) => {
                        socket.to(this.players_id).emit('game:ending', html);
          
                        lastTemplate = html;
                        lastEventId = 'game:ending';
                    });

                }
            
            }, 1000);

        }
        else {

            this.Reset();
            // this.Session.Delete(this.players_id);

            // Dispatch countdown for game timeout
            this.Templates.Load('partials/player/gameended', {time: timeoutTime}, (html) => {
                socket.to(this.players_id).emit('game:ended', html);
          
                this._objLastTemplate = html;
                this._strLastEventId = 'game:ended';
            });


        }

    }

    PlayerReady(player, socket) {

        // If player is re-connecting, set them back to connected, and re-broadcast the last update
        if(this._current_players[player.uid] !== undefined)
        {
            this._current_players[player.uid].connected = true;
            this._current_players[player.uid].socket_id = player.socket_id;

            console.info(player.username + ' has re-joined the game and has uid ' + player.uid); 
            console.log (this._strLastEventId, this._objLastTemplate);
            socket.emit(this._strLastEventId, this._objLastTemplate);
        }
        else {

            this._current_players[player.uid] = {
                                        username: player.username, 
                                        socket_id: player.socket_id, 
                                        index: this.currentPlayerIndex, 
                                        submitted: false, 
                                        connected: true
                                    };

            console.info(player.username + ' has joined the game and has uid ' + player.uid);

            this.currentPlayerIndex++;

            socket.to(this.group_id).emit('players:update', this._current_players);

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

                delete this._current_players[thisPlayer.uid];

                socket.to(this.group_id).emit('players:update', this._current_players);

                // Decrease current # of players
                this._currentPlayerCap = Object.keys(this._current_players).length;

                if(Object.keys(this._current_players).length === 0)
                    Reset();

            }
        }, 15000);

    }

    AdvanceRound(socket) {
        
        // Reset players state for next round
        _.each(this._current_players, (playerId, index) => {

            this._current_players[index] = _.omit(this._current_players[index], 'score');
            this._current_players[index].submitted = false;
        
        });

        // End of game?
        if(this._current_round === this._config.roundNumber-1)
        {
            this.End(socket);
            return;
        }

        this.SaveSession();

        // Advance round
        this._current_round++;

    }

    SaveState(strEventId, objTemplate) {

        this._strLastEventId = strEventId;
        this._objLastTemplate = objTemplate;

        // Save debug data?
        if(process.env.NODE_ENV !== 'production') {
            if(!this._game_session.debugData)
                this._game_session.debugData = {};

            this._game_session.debugData[strEventId] = objTemplate;
            this.SaveSession();
        }

    }

    SaveSession() {

        this.Session.Save(this._game_session);

    }

}

module.exports = Common;