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
var coreModule = require('learning-games-core'),
    Core = coreModule.Core,
    shuffle = coreModule.ShuffleUtil,
    Sentencer = require('sentencer');

class MemeLib extends Core {

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
            let roundlimit = config.roundNumber;

            // Populate content buckets for this session
            this.Topics.find({ 'category': { $in: gameSession.contentCategories} }, (err, result) => {

                // Randomize topics and cap at round limit
                let topics = _.sample(shuffle(result), roundlimit);
                    
                // Save topic IDs to the model's 'topics' key and then cache all topic data for this session
                this._game_session.topics = topics;
                this.allTopics = topics;


            }).populate('category');

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

        let points = this._config.scoreVote;

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
        // this._current_player_cap = Object.keys(this._current_players).length;

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

        data.timeLimit = this._config.timeLimit;
        data.countdownName = 'topicCountdown';

        // Load group and players meme creation screens
        this.Templates.Load('partials/group/meme/create', data, (groupHtml) => {

            this.Templates.Load('partials/player/meme/create', data, (playerHtml) => {
            
                this._group_socket.to(this.group_id).emit('meme:topic', groupHtml);
                this._group_socket.to(this.players_id).emit('game:start', playerHtml);

                this.SaveState('game:start', playerHtml);
                
                // Begin meme creation time limit countdown
                this.Countdown(socket, {countdownName: 'topicCountdown'});
                
                this.eventEmitter.once('countdownEnded', (data, socket) => {
                    
                    this.StartVoting(socket);
                
                });

            });

        });

    }

    MemeSubmitted(playerSocketId, submission, socket) {

        // All memes should be lower case
        let memeUpper = submission.text_upper.toLowerCase();
        let memeLower = submission.text_lower.toLowerCase();

        // If player has not submitted a caption, ask them to try again
        if(!memeUpper && !memeLower) {
            socket.emit('meme:tryagain', 'You need to submit at least one caption!');
            return;
        }

        // If player has submitted nothing, ask them to try again
        else if(!submission) {
            socket.emit('meme:tryagain', 'You need to submit a meme!');
            return;
        } 

        let thisPlayer = this.GetPlayerById(playerSocketId);

        if(!thisPlayer)
            throw new Error("Player with socket_id '" + playerSocketId + "' NOT found!");

        // Create submissions for this player's socket ID
        this._current_submissions[thisPlayer.uid] = {
                                                        upper: memeUpper,
                                                        lower: memeLower,
                                                        player: thisPlayer,
                                                        image: this.allTopics[this._current_round].memeImages[submission.image_index]
                                                    };
                
        thisPlayer.submitted = true;
        
        // Let player know submission received w/ their uid
        // and tell group screen the index of submitter
        socket.emit('meme:received', {player: thisPlayer.uid, random: false});
        this._group_socket.to(this.group_id).emit('meme:received', {id: thisPlayer.uid});

        this._players_submitted.push( thisPlayer );

        console.log(this._players_submitted.length + ' players out of ' + this._current_player_cap + ' have submitted.');

        // All memes received; voting begins
        if(this._players_submitted.length === this._current_player_cap) {
            this.StopCountdown();
            this.StartVoting(socket);
        }

    }

    StartVoting(socket) {

        // Generate any missing submissions
        this.GenerateMissingMemes(socket);

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
            this.SaveState('meme:voting', html);

        });

        // Begin voting countdown and assign countdown end event
        this.Countdown(socket, {timeLimit: this._config.votingTimeLimit, countdownName: 'votingCountdown'});
        this.eventEmitter.on('countdownEnded', (hashtagData, socket) => {
            this.DisplayResults();
        });

        // Reset vote count
        this._votes = 0;

    }

    MemeVote(playerSocketId, submitterId, socket) {        

        let thisSubmission = this._current_submissions[submitterId];

        let thisPlayer = this.GetPlayerById(playerSocketId),
            submitter = this._current_players[submitterId];

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
        let haveAllVotes = this._votes === this._current_player_cap;

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
        
        var lastRound = (this._current_round === this._config.roundNumber - 1);

        var sortedPlayers = _.sortBy(this._current_players, function(player) {return player.score_total}).reverse();
        let submissionVotes = [];
        _.each(this._current_submissions, (submission, index) => {
            console.log(submission);
            if (submission.votes){
                submissionVotes.push(submission);
                
            }


        });
        
        var data = {    
                        submissions: submissionVotes,
                        round: this._current_round+1,
                        players: sortedPlayers,
                        last_round: lastRound,                        
                        survey: this._config.survey
                   };

        let playerData = { last_round: lastRound };
        if(lastRound) {
            playerData.survey = this._config.survey;
            playerData.surveyUrl = this._config.surveyUrl;
        }
        
        // GROUP view
        this.Templates.Load('partials/group/meme/results', data, (html) => {

            this._group_socket.to(this.group_id).emit('meme:results', html);
        
        });

        // PLAYER view
        this.Templates.Load('partials/player/meme/results', playerData, (html) => {
            
            this._group_socket.to(this.players_id).emit('game:round_over', {data: playerData, html: html});
            this.SaveState('game:round_over', html);

            if (lastRound) {
                this._group_socket.to(this.players_id).emit('game:survey');
            }

        });

    }

    GenerateMissingMemes(socket) {

        // Submit random meme text and image for players who did not submit!
        _.each(this._current_players, (player, ind) => {

            // Is player not in array of those who submitted?
            if (!_.contains(this._players_submitted, player)) {
                
                let memeUpper = Sentencer.make('{{an_adjective}} {{noun}}');
                let memeLower = Sentencer.make('{{an_adjective}} {{nouns}}');
                let imageIndex = Math.floor(Math.random() * this.allTopics[this._current_round].memeImages.length) + 0;

                player.submitted = true;

                this._group_socket.to(player.socket_id).emit('meme:received', {player: player.uid, random: true});


                this._current_submissions[player.uid] = {
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