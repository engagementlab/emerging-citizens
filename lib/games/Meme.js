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
    Common = require('./Common'),
    Sentencer = require('sentencer');

class MemeLib extends Common {

    constructor() {

        super();

        this.Topics = this.keystone.list('MemeTopic').model,

        this.allTopics,
        this.allSubmissions = [],

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
            return;
        }

        this.DisplayTopic(socket);

    }

    CalcPlayerScore(currentPlayer) {

        var points = this._config.scoreVoteMeme;

        return super.CalcPlayerScore(currentPlayer, points);

    }

    Reset() {

        // Invoke common method
        super.Reset();

    }

    StartGame(socket) {

        this._game_in_session = true;

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

        data.players = { 
                         left: _.first(_.values(this._current_players), playerCount/2), 
                         right: _.rest(_.values(this._current_players), playerCount/2) 
                       };

        data.timeLimit = this._config.timeLimitMeme;
        data.countdownName = 'topicCountdown';

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

        // Create submissions for this player's socket ID
        this._current_submissions[playerSocketId] = {
                                                        upper: memeUpper,
                                                        lower: memeLower,
                                                        player: thisPlayer,
                                                        image: this.allTopics[this._current_round].memeImages[submission.image_index]
                                                    };
                
        thisPlayer.submitted = true;

        // this._group_socket.to(this.group_id).emit('meme:received', this._current_players);
        socket.emit('meme:received', this._current_submissions[playerSocketId]);

        this._players_submitted.push( thisPlayer );

        console.log(this._players_submitted.length + ' players out of ' + this.currentPlayerCap + ' have submitted.');

        // All memes received; voting begins
        if(this._players_submitted.length === this.currentPlayerCap)
            this.StartVoting();

    }

    StartVoting() {

        // Generate any missing submissions
        this.GenerateMissingMemes();

        // Pick random descriptor from this topic's descriptors object
        let descriptorIndex = Math.floor(Math.random() * this.currentDescriptors.length) + 0;
        let data = {
                        topic: this.allTopics[this._current_round],
                        descriptor: this.currentDescriptors[descriptorIndex],
                        submissions: this._current_submissions
                   };

        this.Templates.Load('partials/group/meme/voting', data, (html) => {
            
            this._group_socket.to(this.group_id).emit('meme:voting', html);

        });

        this.Templates.Load('partials/player/meme/voting', data, (html) => {
            
            this._group_socket.to(this.players_id).emit('meme:voting', html);

        });

        // Reset vote count
        this._votes = 0;

    }

    MemeVote(playerSocketId, memeIndex, socket) {        

        let submitterId = Object.keys(this._current_submissions)[memeIndex],
            thisSubmission = this._current_submissions[submitterId];


        let thisPlayer = this.GetPlayerById(playerSocketId),
            submitter = this.GetPlayerById(submitterId);

        // Calculate score for submitter who received vote
        let voteScore = this.CalcPlayerScore(submitter);

        // thisPlayer.voted = true;

        // Save vote for meme
        if(!thisSubmission.votes) {

            thisSubmission.votes = [ { 
                                        username: thisPlayer.username,
                                        score: voteScore
                                   } ];

        }
        else {

            thisSubmission.votes.push( { 
                                        username: thisPlayer.username,
                                        score: voteScore
                                      } );

        }

        this._votes++;

        // Submissions score is submitter's score
        thisSubmission.score = submitter.score;

        // this._group_socket.to(this.group_id).emit('meme:voted', this._current_players);

        // Check if we have votes for by all players
        let haveAllVotes = this._votes === this.currentPlayerCap;

        // All votes are in, show results
        if(haveAllVotes)
            this.DisplayResults();

    }

    MemeLike(playerSocketId, memeIndex, socket) {        

        let submitterId = Object.keys(this._current_submissions)[memeIndex],
            thisSubmission = this._current_submissions[submitterId];

        let thisPlayer = this.GetPlayerById(playerSocketId);

        // Save like for meme
        if(!thisSubmission.likes)
            thisSubmission.likes = [thisPlayer.username];
        else
            thisSubmission.likes.push(thisPlayer.username);
        
        // this._group_socket.to(this.group_id).emit('meme:liked', this._current_players);

    }

    DisplayResults(force) {

        // Forced mode -- DEBUGGING
        if(force) {
            // Generate any missing submissions
            this.GenerateMissingMemes();
        }

        // Stop countdown
        this.StopCountdown();

        _.each(this._current_players, function(player) {
            if (!player.score_total) 
                player.score_total = 0;
        });
        
        var lastRound = (this._current_round === this._config.roundNumberHashtag - 1);

        var sortedPlayers = _.sortBy(this._current_players, function(player) {return player.score_total}).reverse();
        
        var data = {    
                        submissions: this._current_submissions,
                        round: this._current_round+1,
                        players: sortedPlayers,
                        last_round: lastRound
                   };
        
        // GROUP view
        this.Templates.Load('partials/group/meme/results', data, (html) => {

            this._group_socket.to(this.group_id).emit('meme:results', html);
        
        });

        // PLAYER view
        // this.Templates.Load('partials/player/htyi/results', { last_round: lastRound }, (html) => {
            
        //     this._group_socket.to(this.players_id).emit('game:round_over', html);
        //     this.SaveState('game:round_over', html);

        // });

    }

    GenerateMissingMemes() {

        // Submit random meme text and image for players who did not submit!
        _.each(this._current_players, (player, ind) => {

            // Is player not in array of those who submitted?
            if (!_.contains(this._players_submitted, player)) {
                
                let memeUpper = Sentencer.make('{{an_adjective}} {{noun}}');
                let memeLower = Sentencer.make('{{an_adjective}} {{nouns}}');
                let imageIndex = Math.floor(Math.random() * this.allTopics[this._current_round].memeImages.length) + 0;

                player.submitted = true;

                this._current_submissions[player.socket_id] = {
                                                upper: memeUpper,
                                                lower: memeLower,
                                                player: player,
                                                image: this.allTopics[this._current_round].memeImages[imageIndex]
                                            };
            }  
        
        });

    }

};

module.exports = MemeLib;