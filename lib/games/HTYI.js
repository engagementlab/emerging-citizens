'use strict';

/**
 * Emerging Citizens
 * Developed by Engagement Lab, 2016
 * ==============
 * Hashtag You're It game controller
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

class HashtagLib extends Common {

    constructor() {

        super();

        let randomstring = require('randomstring');

        this._current_tweet,
        this.randomizedHashtags,
        this._votes = 0,
        this._real_hashtag,
        
        // ID to indentify "real" hashtag
        this.realId = randomstring.generate(),
        this.currentPlayerIndex = 0,

        this._all_hashtags = {},
        this._all_tweets;

    }

    Initialize(gameSession) {
        
        // Invoke common method
        super.Initialize(gameSession, (config) => {
            this._config = config;
            // console.log (this._config, "hashtag config");

            var Tweet = this.keystone.list('Tweet').model;

            // Populate content buckets for this session
            Tweet.find({'category': { $in: gameSession.contentCategories}}, (err, result) => {

                // Randomize tweets
                var tweets = shuffle(result);
                
                // Save tweet IDs to the model's 'tweets' key and then cache all tweet data for this session
                this._game_session.tweets = tweets;
                this._all_tweets = tweets;
                
            }).populate("category");
        });
    
    }

    CalcPlayerScore(currentPlayer, real) {

        var points = (real === true) ? this._config.voteScoreReal : this._config.voteScoreGuess;

        if(currentPlayer.socket_id === this.realId) 
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

    StartVoting(socket) {

        // Submit random hashtags for players who did not submit!
        _.each(this._currentPlayers, (player, ind) => {

            // Is player not in array of those who submitted?
            if (!_.contains(this._players_submitted, player)) {
                
                var randomHashtag = Sentencer.make('{{noun}}');
                
                this._currentSubmissions[randomHashtag] = {};
                this._currentSubmissions[randomHashtag].submitters = [ player ];

            }  
        
        });

        // Add real hashtag
        var realHashtag = this._real_hashtag.replace('#', '');
        this._currentSubmissions[realHashtag] = {};
        this._currentSubmissions[realHashtag].submitters = [{ socket_id: this.realId, real: true }];

        // Randomize the hashtag order and make sure all displayed ones for group view are unique
        this.randomizedHashtags = _.shuffle(Object.keys(this._currentSubmissions));

        var data = {
                        hashtags: this.randomizedHashtags, 
                        tweet: this._current_tweet
                   };
        
        this.Templates.Load('partials/player/htyi/voting', this.randomizedHashtags, (html) => {
            
            socket.to(this.players_id).emit('hashtags:received', html);
            this.SaveState('hashtags:received', html);
        
        });

        this.Templates.Load('partials/group/htyi/voting', data, (html) => {
            socket.to(this.group_id).emit('hashtags:received', html);

            // Begin voting countdown and assign countdown end event
            this.Countdown(socket, data);
            this.eventEmitter.on('countdownEnded', (hashtagData, socket) => {
                this.ShowSubmissions(socket);
            });  
            // this._event_countdown_done = this.ShowSubmissions;
        });

        // Reset vote count
        this._votes = 0;

    }

    ShowSubmissions(socket) {

        // Stop countdown
        this.StopCountdown();

        _.each(this._currentSubmissions, function(hashtag, index) {
            hashtag['votes'] = _.uniq(hashtag['votes'], 'user');
        });

        _.each(this._currentPlayers, function(player) {
            if (player.score_total === undefined) 
                player.score_total = 0;
        });
        
        var lastRound = (this._current_round === this._config.roundNumber-1);
        var sortedPlayers = _.sortBy(this._currentPlayers, function(player) {return player.score_total}).reverse();
        
        var data = {    
                        hashtags: this._currentSubmissions,
                        tweet: this._current_tweet,
                        round: this._current_round,
                        players: sortedPlayers,
                        last_round: lastRound
                   };
        
        // GROUP view
        this.Templates.Load('partials/group/htyi/results', data, (html) => {
            socket.to(this.group_id).emit('hashtags:results', html);
        });

        // PLAYER view
        this.Templates.Load('partials/player/htyi/results', { last_round: lastRound }, (html) => {
            
            socket.to(this.players_id).emit('game:round_over', html);
            this.SaveState('game:round_over', html);

        });

    }
    
    AdvanceRound(socket) {
        console.log (socket, "socket");
        // Store and reset hashtags
        this._all_hashtags[this._current_round] = this._currentSubmissions;
        
        // Invoke common method
        super.AdvanceRound(socket);

        this.DisplayTweet(this._current_round, socket);

    }
    
    StartGame(socket) {

        // First round
        this._current_round = 0;
        // console.log (this._currentPlayers, "current players start game");
        // Get current # of players
        this.currentPlayerCap = Object.keys(this._currentPlayers).length;

        this.DisplayTweet(this._current_round, socket);

    };
 
    DisplayTweet(tweetIndex, socket) {

        var data = this._all_tweets[tweetIndex];
        var playerCount = Object.keys(this._currentPlayers).length;

        if(data === undefined)
        {
            // No tweets left, end game
            console.warn('Tweet data for round is undefined! Ending game.');
            this.End(socket, true);
            return;
        }

        // Cache the real hashtag and tweet
        this._real_hashtag = data.hashtag.toLowerCase().replace('#', '');
        this._current_tweet = data.tweetText;

        data.players = { 
                         left: _.first(_.values(this._currentPlayers), playerCount/2), 
                         right: _.rest(_.values(this._currentPlayers), playerCount/2) 
                       };

        this.Templates.Load('partials/player/htyi/tweet', data, (html) => {

            socket.to(this.players_id).emit('game:start', {html: html});
            this.SaveState('game:start', html);
        
        });

        this.Templates.Load('partials/group/htyi/tweet', data, (html) => {
            
            socket.to(this.group_id).emit('game:start', html);
        
            // Begin first countdown and assign end event
            this.Countdown(socket, data);
            // console.log (topicData, "topic data");
            this.eventEmitter.on('countdownEnded', (hashtagData, socket) => {
                this.StartVoting(socket);
            });  

        });

    }
    
    HashtagSubmitted(playerSocketId, submission, socket, space) {

        // If player has submitted the real hashtag, ask them to try again
        if(submission === undefined || submission.length === 0) {
            socket.emit('hashtag:tryagain', 'You need to submit a hashtag!');
            return;
        }

        // All hashtags should be lower case and not include #
        let thisHashtag = submission.toLowerCase().replace('#', '');
        let thisPlayer = this.GetPlayerById(playerSocketId);

        if(thisPlayer === undefined)
            throw new Error("Player with socket_id '" + playerSocketId + "' NOT found!");
        
        // If player has submitted the real hashtag, ask them to try again
        let realMatch = new RegExp("\\b" + this._real_hashtag + "\\b").test(thisHashtag);
        if(realMatch) {
            socket.emit('hashtag:tryagain', 'You guessed the actual hashtag! Please try again.');
            return;
        }
        // If duplicate hashtag, add to that hashtag array in _current_submissions.submitters object
        if (_.has(this._currentSubmissions, thisHashtag))
            this._currentSubmissions[thisHashtag].submitters.push( thisPlayer );
        
        else {
            this._currentSubmissions[thisHashtag] = {};
            this._currentSubmissions[thisHashtag].submitters = [thisPlayer];
        }
        
        thisPlayer.submitted = true;

        socket.emit('hashtag:success', thisHashtag);

        console.log(thisPlayer.username + ' submitted hashtag "' + thisHashtag + '".');

        this._players_submitted.push( thisPlayer );

        console.log(this._players_submitted.length + ' players out of ' + this.currentPlayerCap + ' have submitted.');

        // All hashtags received; voting begins
        if(this._players_submitted.length === this.currentPlayerCap)
            this.StartVoting(space);

    }
    
    HashtagVote(playerId, hashtag, socket) {

        let thisSubmission = this._currentSubmissions[hashtag];
        let thisPlayer = this.GetPlayerById(playerId);
        let voteScore = 0;

        for (var submitter of thisSubmission.submitters) {
            console.log (submitter);
            // Calculate score for voter if real hashtag, or for submitter if theirs was guessed
            if(submitter.real) 
                voteScore = this.CalcPlayerScore(thisPlayer, true); 
            else
                voteScore = this.CalcPlayerScore(this.GetPlayerById(submitter.socket_id), false);

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
        
        this._votes++;

        console.log(thisPlayer.username + ' voted for "' + hashtag + '".');

        // All votes are in, show results
        if(this._votes >= this.currentPlayerCap)
            this.ShowSubmissions(socket);

    }

};

module.exports = HashtagLib;