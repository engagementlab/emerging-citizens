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
            this.Topics.find({'category': { $in: gameSession.contentCategories }}, (err, result) => {

                // Randomize topics
                let topics = shuffle(result);
                
                // Save topic IDs to the model's 'topics' key and then cache all topic data for this session
                this._game_session.topics = topics;
                this.allTopics = topics;
                
            }).populate("category");

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

        this.Templates.Load('partials/group/meme/topic', data, (html) => {
            
            this._group_socket.to(this.group_id).emit('meme:topic', html);
            this.SaveState('meme:topic', html);

        });

    }
 
    

};

module.exports = MemeLib;