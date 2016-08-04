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

    }

    Initialize(gameSession) {
        
        // Invoke common method
        super.Initialize(gameSession, (config) => {
            
            this._config = config;

        });

    
    }

    AdvanceRound(socket) {

        // Invoke common method
        super.AdvanceRound(socket);

        if(this._current_round === this._config.roundNumberWiki)
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
 
    

};

module.exports = MemeLib;