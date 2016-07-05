'use strict';

/**
 * Emerging Citizens
 * Developed by Engagement Lab, 2016
 * ==============
 * WikiGeeks game controller
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

class WikiLib extends Common {

    constructor() {

        super();

        this.Links = this.keystone.list('WikiLink'),

        this.allArticles = [],
        this.playerProgress = {};

        this.currentPlayerIndex = 0;

    }

    Initialize(gameSession) {
        
        // Invoke common method
        super.Initialize(gameSession, (config) => {
            
            this._config = config;

            // Content buckets for this session
            this.Links.model.find({}, (err, result) => {
                
                var roundlimit = config.roundNumberWiki;

                // Randomize topics
                let topics = shuffle(result);

                topics = _.sample(topics, roundlimit);

                _.each (topics, (topic, index) => {

                    let topicName = topic.category.topicName;
                    let topicImage = topic.category.topicImage;
                    let topicDescription = topic.category.topicDescription.html;
                    let article = topic.articleName;
                    let articleImage = topic.articleImage;
                    let articleDescription = topic.articleDescription.html;
                    
                    this.allArticles.push ({ 
                                                "topicName": topicName,
                                                "topicImage" : topicImage, 
                                                "topicDescription" : topicDescription,
                                                "article" : article,
                                                "articleDescription" : articleDescription,
                                                "articleImage" : articleImage 
                                            });
               
                });
                
                // // Save link IDs to the model's 'links' key and then cache all link data for this session
                // this._game_session.topics = this.allArticles;
                // this._game_session.data = ["some"];
                // console.log (this._game_session, "game session");
                // // _ALL_LINKS = links;
                
            }).populate ("category");

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

    StartLinking(socket) {

        // Choose random starting article for players who did not submit!
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
        
        this.Templates.Load('partials/player/voting', this.randomizedHashtags, (html) => {
            
            socket.to(this.players_id).emit('hashtags:received', html);
            this.SaveState('hashtags:received', html);
        
        });

        this.Templates.Load('partials/group/voting', data, (html) => {
            socket.to(this.group_id).emit('hashtags:received', html);

            // Begin voting countdown and assign countdown end event
            this._countdown(socket);
            this._event_countdown_done = this.ShowSubmissions;
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
        this.Templates.Load('partials/group/results', data, (html) => {
            socket.to(this.group_id).emit('hashtags:results', html);
        });

        // PLAYER view
        this.Templates.Load('partials/player/results', { last_round: lastRound }, (html) => {
            
            socket.to(this.players_id).emit('game:round_over', html);
            this.SaveState('game:round_over', html);

        });

    }
    
    AdvanceRound(socket) {

        // Store and reset hashtags
        this._all_hashtags[this._current_round] = this._currentSubmissions;
        
        // Invoke common method
        super.AdvanceRound(socket);

        this.DisplayTweet(this._current_round, socket);

    }
    
    StartGame(socket) {

        // First round
        this._current_round = 0;

        // Get current # of players
        this.currentPlayerCap = Object.keys(this._currentPlayers).length;
        console.log (this._currentPlayers, "current players");

        this.DisplayTopic(this._current_round, socket);

    }
 
    DisplayTopic(articleIndex, socket) {
        
        var data = this.allArticles[articleIndex];
        var playerCount = Object.keys(this._currentPlayers).length;

        // Don't do this for now
        /*if(data === undefined)
        {
            // No tweets left, end game
            console.warn('Topic data for round is undefined! Ending game.');
            this.End(socket, true);
            return;
        }*/

        data.players = { 
                         left: _.first(_.values(this._currentPlayers), playerCount/2), 
                         right: _.rest(_.values(this._currentPlayers), playerCount/2) 
                       };
        data.timeLimit = this._config.articleCooldownWiki;

        this.Templates.Load('partials/player/wiki/search', data, (html) => {

            socket.to(this.players_id).emit('game:start', html);
            this.SaveState('game:start', html);
        
        });

        this.Templates.Load('partials/group/wiki/topic', data, (html) => {

            socket.to(this.group_id).emit('game:start', {timeLimit: this._config.articleCooldownWiki, html: html});
            
            // Begin first countdown and assign end event
            this.Countdown(socket, data);
            
            this.eventEmitter.on('countdownEnded', (data, socket) => {
                this.DisplayArticle(data, socket);
            });  

        });
    }

    DisplayArticle(data, socket) {
        console.log (data, "data", "displaying article");

        var data = data;
        var playerCount = Object.keys(this._currentPlayers).length;

        if(data === undefined)
        {
            // No tweets left, end game
            console.warn('Article data for round is undefined! Ending game.');
            
            this.End(socket, true);
            return;
        }

        data.players = { 
                         left: _.first(_.values(this._currentPlayers), playerCount/2), 
                         right: _.rest(_.values(this._currentPlayers), playerCount/2) 
                       };

        this.Templates.Load('partials/player/wiki/article', data, (html) => {

            socket.to(this.players_id).emit('topic:info', html);
            this.SaveState('topic:info', html);
        
        });

        this.Templates.Load('partials/group/wiki/article', data, (html) => {
        
            // Begin first countdown and assign end event
            this.Countdown(socket);
            this.eventEmitter.on('countdownEnded', (socket, data) => {
            
                socket.to(this.group_id).emit('topic:info', html);
                // this.SearchArticles(socket, data.articleTitle);
            });

        });

    }

    SearchArticles(socket, playerQuery) {

        if(!playerQuery)
            return;

        let queryCleaned = playerQuery.replace(/ /g, "+");
        var extractUrl = 'https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&redirects&titles=' + queryCleaned;
        
        this.Templates.Load('partials/player/wiki/article', {html: articleExtract}, (html) => {

            socket.emit('article:found', {html: html, articleId: articleId});
        
        });

    }

    PlayerClick(playerSocket, articleTitle) {

        let thisPlayer = this.GetPlayerById(playerSocket.id);
        let playerProgress = this.playerProgress;

        if(!playerProgress[this._current_round])
            playerProgress[this._current_round] = {};

        if(!playerProgress[this._current_round][playerSocket.id])
            playerProgress[this._current_round][playerSocket.id] = [articleTitle];
        else
            playerProgress[this._current_round][playerSocket.id].push(articleTitle);

        this.playerProgress = playerProgress;

        // Did player get to target article?
        if(articleTitle === this.allArticles[this._current_round].articleName) {

            thisPlayer.finished = true;
            playerSocket.emit('article:target', playerProgress[this._current_round][playerSocket.id]);
        
        }

    }
    

};

module.exports = WikiLib;