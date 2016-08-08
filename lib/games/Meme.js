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

        this.allTopics,
        this.allSubmissions,

        this.currentDescriptors;

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

        // Store and reset submissions
        this.allSubmissions[this._current_round] = this._current_submissions;

        this._current_submissions = {};

        this._players_submitted = [];

        // Attach submissions to game session in order to save progress to DB
        this._game_session.submissions = this.allSubmissions;

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
        
        // Get current # of players
        this.currentPlayerCap = Object.keys(this._current_players).length;

        this.DisplayTopic(socket);

    }
 
    DisplayTopic(socket) {

        // Reset players submitted
        this.playersSubmitted = [];
        
        let data = this.allTopics[this._current_round];
        let playerCount = Object.keys(this._current_players).length;

        this.currentDescriptors = data.topicDescriptors;

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

    MemeSubmitted(playerSocketId, submission, socket) {

        console.log('MemeSubmit');

        // All memes should be lower case
        let memeUpper = submission.text_upper.toLowerCase();
        let memeLower = submission.text_lower.toLowerCase();

        let thisPlayer = this.GetPlayerById(playerSocketId);

        // If player has submitted nothing, ask them to try again
        if(!submission || (memeUpper.length === 0 || memeLower.length === 0)) {
            socket.emit('meme:tryagain', 'You need to submit a meme!');
            return;
        } 

        if(!thisPlayer)
            throw new Error("Player with socket_id '" + playerSocketId + "' NOT found!");
        
        /*// If duplicate hashtag, add to that hashtag array in _current_submissions.submitters object
        if (_.has(this._current_submissions, thisHashtag))
            this._current_submissions[thisHashtag].submitters.push( thisPlayer );*/

        this._current_submissions[playerSocketId] = {
                                                        upper: memeUpper,
                                                        lower: memeLower,
                                                        username: thisPlayer.username,
                                                        image: this.allTopics[this._current_round].memeImages[submission.image_index]
                                                    };
                
        thisPlayer.submitted = true;

        socket.to(this.group_id).emit('meme:received', this._current_players);
        socket.emit('meme:received', this._current_submissions[playerSocketId]);

        console.log(thisPlayer.username + ' submitted meme "' + this._current_submissions[playerSocketId] + '".');

        this._players_submitted.push( thisPlayer );

        console.log(this._players_submitted.length + ' players out of ' + this.currentPlayerCap + ' have submitted.');

        // All memes received; voting begins
        if(this._players_submitted.length === this.currentPlayerCap)
            this.StartVoting();

    }

    StartVoting() {

        let data = {
                        topic: this.allTopics[this._current_round],
                        descriptor: this.currentDescriptors[this._current_round],
                        submissions: this._current_submissions
                   };

        console.log('StartVoting');

        this.Templates.Load('partials/group/meme/voting', data, (html) => {
            
            this._group_socket.to(this.group_id).emit('meme:voting', html);

        });

        this.Templates.Load('partials/player/meme/voting', data, (html) => {
            
            this._group_socket.to(this.players_id).emit('meme:voting', html);

        });

    }

};

module.exports = MemeLib;