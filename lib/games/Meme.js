'use strict';

/**
 * Emerging Citizens
 * Developed by Engagement Lab, 2016
 * ==============
 * Wait Wait Don't Meme Me game controller
 *
 * @class lib/games
 * @static
 * @author Johnny Richardson
 * @author Erica Salling
 *
 * ==========
 */
var shuffle = require('../ShuffleUtil'),
    Common = require('./Common');

class MemeLib extends Common {

    constructor() {

        super();

        this.Topics = this.keystone.list('MemeTopic').model,

        this.allTopics;

    }

    Initialize(gameSession) {
        
        // Invoke common method
        super.Initialize(gameSession, (config) => {
            
            this._config = config;

            // Populate content buckets for this session
            // TODO: by category
            // {'category': { $in: gameSession.contentCategories }}
            this.Topics.find({}, (err, result) => {

                // Randomize topics
                let topics = shuffle(result);
                
                // Save topic IDs to the model's 'topics' key and then cache all topic data for this session
                this._game_session.topics = topics;
                this.allTopics = topics;
                
            });

        });

    }

    AdvanceRound(socket) {

        // Invoke common method
        super.AdvanceRound(socket);

        if(this._current_round === this.allTopics.length)
        {
            this.End(socket);
            console.log("the game is ending");
            return;
        }

    }

    Reset() {

        // Invoke common method
        super.Reset();

    }

    StartGame(socket) {

        this._game_in_session = true;

        // Setup group socket (used for some methods dispatched from emitter)
        this._group_socket = socket;

        // First round
        this._current_round = 0;

        this.DisplayTopic(socket);

    }
 
    DisplayTopic(socket) {

        // Reset players submitted
        this.playersSubmitted = [];
        
        let data = this.allTopics[this._current_round];
        let playerCount = Object.keys(this._current_players).length;

        console.log('Current topic is "%s"', data.topicName);

        if(!data)
        {

            // No topics left, end game
            console.warn('Topic data for round is undefined! Ending game.');
            
            this.End(this._group_socket, true);
            return;

        }

        // Load group and players meme creation screens
        this.Templates.Load('partials/group/meme/create', data, (groupHtml) => {

            this.Templates.Load('partials/player/meme/create', data, (playerHtml) => {
            
                this._group_socket.to(this.group_id).emit('meme:topic', groupHtml);
                this._group_socket.to(this.players_id).emit('meme:create', playerHtml);

                this.SaveState('meme:create', playerHtml);
                
                // Begin meme creation time limit countdown
                this.Countdown(socket, { timeLimit: this._config.timeLimitMeme });
                
                this.eventEmitter.once('countdownEnded', (data, socket) => {
                    
                    this.StartVoting();
                
                });

            });

        });

    }

    StartVoting() {

        console.log('StartVoting');

    }
 
    

};

module.exports = MemeLib;