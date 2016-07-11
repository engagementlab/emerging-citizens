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
        this.playerProgress = {},
        this._players_submitted = [],

        this.currentPlayerIndex = 0,

        this.groupSocket;

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
                console.log (topics, "topics");

                topics = _.sample(topics, roundlimit);

                _.each (topics, (topic, index) => {

                    console.log(topic.category)

                    let topicName = topic.category[0].topicName;
                    let topicImage = topic.category[0].topicImage;
                    let topicDescription = topic.category[0].topicDescription.html;

                    let article = topic.articleName;
                    let articleImage = topic.articleImage;
                    let articleDescription = topic.articleDescription.html;
                    
                    this.allArticles.push ({ 
                                                "topicName": topicName,
                                                "topicImage" : topicImage, 
                                                "topicDescription" : topicDescription,
                                                "articleName" : article,
                                                "articleDescription" : articleDescription,
                                                "articleImage" : articleImage 
                                            });
               
                });
                
            }).populate ("category");

        });

    
    }

    AdvanceRound(socket) {

        // Invoke common method
        super.AdvanceRound(socket);

        this.DisplayTopic(socket);

    }

    StartGame(socket) {

        // Setup group socket (used for some methods dispatched from emitter)
        this.groupSocket = socket;

        // First round
        this._current_round = 0;

        // Get current # of players
        this.currentPlayerCap = Object.keys(this._current_players).length;

        this.DisplayTopic(socket);

    }
 
    DisplayTopic(socket) {
        
        var data = this.allArticles[this._current_round];

        console.log('Target article is "%s"', data.articleName);

        var playerCount = Object.keys(this._current_players).length;

        if(!data)
        {
            // No data, end game?
            throw new Error('Topic data for round is undefined! Ending game.');
            
            // this.End(socket, true);
            return;
        }

        data.players = { 
                         left: _.first(_.values(this._current_players), playerCount/2), 
                         right: _.rest(_.values(this._current_players), playerCount/2) 
                       };

        data.timeLimit = this._config.articleCooldownWiki;
        data.countdownName = 'topicReveal';

        this.Templates.Load('partials/player/wiki/search', data, (html) => {

            socket.to(this.players_id).emit('game:start', html);

            this.SaveState('game:start', html);
        
        });

        this.Templates.Load('partials/group/wiki/article_reveal', undefined, (revealHtml) => {

            this.Templates.Load('partials/group/wiki/topic', data, (html) => {

                socket.to(this.group_id).emit('game:start', {reveal: revealHtml, html: html});
                
                // Begin topic reveal countdown and assign end event
                this.Countdown(socket, data);
                
                this.eventEmitter.once('countdownEnded', (data, socket) => {
                    this.DisplayArticle();
                });

            });

        });
    }

    DisplayArticle() {

        let data = this.allArticles[this._current_round];

        console.log ("displaying article", data);

        var playerCount = Object.keys(this._current_players).length;


        if(!data)
        {
            // No tweets left, end game
            console.warn('Article data for round is undefined! Ending game.');
            
            this.End(this.groupSocket, true);
            return;
        }

        data.players = { 
                         left: _.first(_.values(this._current_players), playerCount/2), 
                         right: _.rest(_.values(this._current_players), playerCount/2) 
                       };

        this.groupSocket.to(this.players_id).emit('topic:info');
        // this.SaveState('topic:info', html);

        this.Templates.Load('partials/group/wiki/article', data, (html) => {
            
            this.groupSocket.to(this.group_id).emit('topic:info', html);
        
            // Begin countdown for players to reach article
            this.Countdown(this.groupSocket, {countdownName: 'results'});
            this.eventEmitter.once('countdownEnded', (data, socket) => {
                // Show results!
                this.DisplayResults(socket);
            });

        });

    }

    DisplayResults(socket) {

        // Copy progress for use in this scope only
        let progress = Object.assign({}, this.playerProgress[this._current_round]);

        for(var playerId in progress) {

            let thisPlayerProgress = progress[playerId];
            let thisPlayer = this.GetPlayerById(playerId);

            thisPlayerProgress.username = thisPlayer.username;

            // If player never finished, set their time to the entire duration
            if(!thisPlayerProgress.finished)
                thisPlayerProgress.time = this._config.timeLimitWiki;

            // Calc total score
            thisPlayerProgress.score_sum = _.reduce(thisPlayerProgress.scores, function(memo, num){ return memo + num; });

            console.log('Score is %s for player %s', thisPlayerProgress.score_sum, thisPlayerProgress.username)

            // Set this player's total cumulative score
            if(!thisPlayer.score_total)
                thisPlayer.score_total = thisPlayerProgress.score_sum;
            else
                thisPlayer.score_total += thisPlayerProgress.score_sum;

            // Get number of clicks for player's progress
            thisPlayerProgress.clicks = thisPlayerProgress.articles.length;

        }

        // Order leaderboard by player scores
        let leaderboard = _.sortBy(this._current_players, function(player) {return player.score_total});

        let data = {
                        results: progress,
                        leaderboard: leaderboard,
                        round: this._current_round+1,
                        title: this.allArticles[this._current_round].articleName
                   };

        this.Templates.Load('partials/group/wiki/results', data, (html) => {
            
            socket.to(this.group_id).emit('topic:results', html);

        });

    }

    PlayerClick(playerSocket, articleTitle, initialSearch) {
        
        let thisPlayer = this.GetPlayerById(playerSocket.id);

        // Track all initial searches
        if(initialSearch) {
    
            var articleData = this.allArticles[this._current_round];

            this._players_submitted.push(playerSocket.id);
    
            if(this._players_submitted.length === this.currentPlayerCap) {

                // Stop reveal countdown
                this.StopCountdown();

                // Initiate new countdown of 3s (we're fast-forwarding)
                this.Countdown(playerSocket, {timeLimit: 3, countdownName: 'topicReveal'});
                
                // Display article in 3s
                this.eventEmitter.once('countdownEnded', (data, socket) => {
                    this.DisplayArticle();
                });
                
            }
    
        }

        let playerSubmission = articleTitle.replace(/_/g, ' ');
        let allPlayerProgress = this.playerProgress;

        console.log("%s went to article '%s' and target is '%s'", thisPlayer.username, playerSubmission, this.allArticles[this._current_round].articleName)

        if(!allPlayerProgress[this._current_round])
            allPlayerProgress[this._current_round] = {};

        if(!allPlayerProgress[this._current_round][playerSocket.id])
            allPlayerProgress[this._current_round][playerSocket.id] = { articles: [], scores: [0, 0, 0] };

        let thisPlayerProgress = allPlayerProgress[this._current_round][playerSocket.id];
        
        // Make 'time' a mutable property for assignment later
        Object.defineProperty(thisPlayerProgress,
                              'time',
                              {writable: true, value: 0}
                             );

        thisPlayerProgress.articles.push(playerSubmission);

        // Did player get to target article?
        if(playerSubmission === this.allArticles[this._current_round].articleName) {

            let playerFinishedCt = _.pluck(allPlayerProgress, "finished").length;

            thisPlayerProgress.finished = true;

            thisPlayerProgress.time = this._config.timeLimitWiki - this._countdown_duration;
            thisPlayerProgress.scores[0] = this._config.scoreTargetReachedWiki;
            thisPlayerProgress.scores[0] = this._config.scorePlacementWiki * playerFinishedCt;

            console.log('%s players are done', playerFinishedCt);

            if(thisPlayerProgress.articles.length < 10)
                thisPlayerProgress.scores[2] = this._config.scoreUnderClicksWiki;

            playerSocket.emit('article:target', thisPlayerProgress);
            // TODO: Advance when all players are here
        
        }

        allPlayerProgress[this._current_round][playerSocket.id] = thisPlayerProgress;
        this.playerProgress = allPlayerProgress;


    }
    

};

module.exports = WikiLib;