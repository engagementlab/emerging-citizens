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

        this.urlRandomArticle = 'https://en.wikipedia.org/w/api.php?format=json&action=query&format=json&list=random&rnnamespace=0&rnfilterredir=nonredirects&rnlimit=1',

        this.Links = this.keystone.list('WikiLink'),
        this.request = require('request'),

        this.allArticles = [],
        this.playerProgress = {},
        this.playersSubmitted = [],

        this.currentPlayerIndex = 0,

        // Are we waiting for one player to reach target article after time expiry?
        this.waitingForFinish = false,
        this.excessCountdown,
        this.excessDuration = 0,
        this.playerFinishedCt = 0;

    }

    Initialize(gameSession) {
        
        // Invoke common method
        super.Initialize(gameSession, (config) => {
            
            this._config = config;

            // Content buckets for this session
            this.Links.model.find({}, (err, result) => {
                
                var roundlimit = config.roundNumberWiki;

                // Randomize topics
                let links = _.sample(shuffle(result), roundlimit);

                _.each (links, (link, index) => {

                    let contentCategory = link.category[Math.floor(Math.random() * link.category.length)];

                    let topicName = contentCategory.topicName;
                    let topicImage = contentCategory.topicImage;
                    let topicDescription = contentCategory.topicDescription.html;

                    let article = link.articleName.toLowerCase();
                    let articleImage = link.articleImage;
                    let articleDescription = link.articleDescription.html;
                    
                    this.allArticles.push ({ 
                                                "topicName": topicName,
                                                "topicImage" : topicImage, 
                                                "topicDescription" : topicDescription,
                                                "articleName" : article,
                                                "articleDescription" : articleDescription,
                                                "articleImage" : articleImage 
                                            });

                    // console.log (this.allArticles, "all articles");
               
                });
                
            }).populate ("category");

        });

    
    }

    AdvanceRound(socket) {

        // Attach submissions to game session in order to save progress to DB
        this._game_session.submissions = this.playerProgress;

        // Invoke common method
        super.AdvanceRound(socket);

        if(this._current_round === this._config.roundNumberWiki)
        {
            this.End(socket);
            console.log("the game is ending");
            return;
        }

        this.playersSubmitted = [];
        this.waitingForFinish = false;

        this.DisplayTopic(socket);

    }

    Reset() {

        this.playerProgress = {};

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

        // Other defaults set
        this.waitingForFinish = false,
        this.playerFinishedCt = 0;
        
        let data = this.allArticles[this._current_round];
        let playerCount = Object.keys(this._current_players).length;

        console.log('Target article is "%s"', data.articleName);

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
        data.countdownName = 'topicCountdown';

        this.Templates.Load('partials/player/wiki/search', data, (html) => {

            socket.to(this.players_id).emit('game:start', html);

            this.SaveState('game:start', html);
        
        });


        this.Templates.Load('partials/group/wiki/topic', data, (html) => {

            socket.to(this.group_id).emit('game:start', {html: html});
            
            // Begin topic reveal countdown and assign end event
            this.Countdown(socket, data);
            
            this.eventEmitter.once('countdownEnded', (data, socket) => {

                this.DisplayArticle();
            
            });

        });

    }

    DisplayArticle(playerSocketId) {

        let data = this.allArticles[this._current_round];

        // Show topic info only after checking if all players have an article
        let playerChecked = _.after(this.currentPlayerCap, () => {
            
            var playerCount = Object.keys(this._current_players).length;

            if(!data)
            {
                // No article data, end game
                console.warn('Article data for round is undefined! Ending game.');
                
                this.End(this._group_socket, true);
                return;
            }

            data.players = _.values(this._current_players);
            data.round = this._current_round+1;
                           
            this._group_socket.to(this.players_id).emit('topic:info');

            this.Templates.Load('partials/group/wiki/article', data, (html) => {
                
                this._group_socket.to(this.group_id).emit('topic:info', html);
            
                // Begin countdown for players to reach article
                this.Countdown(this._group_socket, {countdownName: 'results'});
                this.eventEmitter.once('countdownEnded', (data, socket) => {
                    console.log ("we are now displaying results");
                    // Show results!
                    this.DisplayResults();
                
                });

            });

        });

        // random starting article for players who never submitted
        _.each (this._current_players, (player, index) => {
            
            if (!player.submitted) {
               
                // Get a random article title for player
                this.request(this.urlRandomArticle, (error, response, body) => {
              
                    // Valid response?
                    if (!error && response.statusCode == 200) {

                        let article = JSON.parse(body).query.random[0].title;

                        // Record the article
                        this.PlayerClick (player.socket_id, article, false);

                        // Send the player the title to use
                        this._group_socket.to(player.socket_id).emit('article:random', article);

                        playerChecked();

                    }
                
                });

            }
            else {
                playerChecked();
            }

        });

    }

    DisplayResults(force) {

        // If no players have finished, don't continue, and wait until one player reaches target
        let playersFinished = _.some(this.playerProgress[this._current_round], function(player) { return _.has(player, "finished"); });
        
        if (!playersFinished && !force) {

            this.StartExcessCountdown();

            this._group_socket.to(this.group_id).emit('wiki:waiting');
            this.waitingForFinish = true;
            
            return;
        
        } 
        // Cache val for if last round
        let lastRound = (this._current_round === this._config.roundNumberWiki - 1);

        // Copy progress for use in this scope only
        let progress = Object.assign({}, this.playerProgress[this._current_round]);

        // Show group results only after all players get their results
        let playersHaveResults = _.after(Object.keys(progress).length, () => {

            // Order round progress by score sum per player
            let progressSorted = _.sortBy(progress, function(player) {return player.score_sum}).reverse();
            // Order leaderboard by player scores
            let players = _.sortBy(this._current_players, function(player) {return player.score_total}).reverse();

            let data = {
                            results: progressSorted,
                            players: players,
                            round: this._current_round+1,
                            title: this.allArticles[this._current_round].articleName,
                            last_round: lastRound
                       };

            this.Templates.Load('partials/group/wiki/results', data, (html) => {
                
                this._group_socket.to(this.group_id).emit('wiki:results', html);
                this.SaveState('wiki:results', html);

            });

        });

        let loadPlayerResults = (data, playerId) => {

            data.last_round = lastRound;
            // data.GetPlayerById(playerId)

            // Load results view for player
            this.Templates.Load('partials/player/wiki/results', data, (html) => {

                console.log(data);

                this._group_socket.to(playerId).emit('wiki:results', html);

                // Players has results
                playersHaveResults();

            });

        }

        // Move through each player's progress
        for(var playerId in progress) {

            let thisPlayerProgress = progress[playerId];
            let thisPlayer = this.GetPlayerById(playerId);

            if(!thisPlayer)
                continue;

            thisPlayerProgress.username = thisPlayer.username;

            // If player never finished, set their time to the entire duration PLUS any excess
            if(!thisPlayerProgress.finished)
                thisPlayerProgress.time = this._config.timeLimitWiki + this.excessDuration;

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

            loadPlayerResults(thisPlayerProgress, playerId);

        }

    }

    
    PlayerClick(playerSocketId, articleTitle, initialSearch) {

        articleTitle = articleTitle.toLowerCase();
        
        let thisPlayer = this.GetPlayerById(playerSocketId);

        if(!thisPlayer)
            return;

        thisPlayer.submitted = true;

        // Track all initial searches
        if(initialSearch) {
    
            let articleData = this.allArticles[this._current_round];
            _.extend(_.findWhere(this._current_players, {socket_id: playerSocketId}), thisPlayer);
            
            this.playersSubmitted.push(playerSocketId);

            if (this._countdown_duration > 6 && 
                this._countdown_duration !== this._config.timeLimitWiki
               ) {

                if(this.playersSubmitted.length === this.currentPlayerCap) {

                    // Stop topic countdown
                    this.StopCountdown();

                    // Initiate new countdown of 6s (we're fast-forwarding)
                    this.Countdown(this._group_socket, {timeLimit: 6, countdownName: 'topicCountdown'});
                    
                    // Display article in 6s
                    this.eventEmitter.once('countdownEnded', (data, socket) => {
                        this.DisplayArticle();
                    });
                    
                }
            }
    
        }

        let playerSubmission = articleTitle.replace(/_/g, ' ');
        playerSubmission = decodeURIComponent('"' + playerSubmission + '"');
        playerSubmission = playerSubmission.toLowerCase();
        playerSubmission = playerSubmission.replace(/"/g, '');
        let allPlayerProgress = this.playerProgress;

        console.log("%s went to article '%s' and target is '%s'", thisPlayer.username, playerSubmission, this.allArticles[this._current_round].articleName)

        if(!allPlayerProgress[this._current_round])
            allPlayerProgress[this._current_round] = {};

        if(!allPlayerProgress[this._current_round][playerSocketId])
            allPlayerProgress[this._current_round][playerSocketId] = { articles: [], scores: [0, 0, 0] };

        let thisPlayerProgress = allPlayerProgress[this._current_round][playerSocketId];
        
        // Make 'time' a mutable property for assignment later
        Object.defineProperty(thisPlayerProgress,
                              'time',
                              {writable: true, value: 0}
                             );

        thisPlayerProgress.articles.push(playerSubmission);

        // Did player get to target article?
        if(playerSubmission === this.allArticles[this._current_round].articleName) {

            let thisPlayer = this.GetPlayerById(playerSocketId);

            thisPlayer.finished = true;

            // Get count of all other players done and add this one
            this.playerFinishedCt++;
            let allPlayersFinished = (this.playerFinishedCt === this.currentPlayerCap);

            thisPlayerProgress.finished = true;
            thisPlayerProgress.username = thisPlayer.username;

            // Use time limit + excess if we've gone past time expiry
            if(!this.waitingForFinish) {
                console.log(this._config.timeLimitWiki, this._countdown_duration, this._config.timeLimitWiki - this._countdown_duration);
                thisPlayerProgress.time = (this._config.timeLimitWiki - this._countdown_duration);
                console.log(thisPlayerProgress.time);
            }
            else {
                console.log (this._config.timeLimitWiki + this.excessDuration);
                thisPlayerProgress.time = (this._config.timeLimitWiki + this.excessDuration);
                console.log(thisPlayerProgress.time);
            }

            thisPlayerProgress.clicks = thisPlayerProgress.articles.length;

            thisPlayerProgress.scores[0] = this._config.scoreTargetReachedWiki;
            thisPlayerProgress.scores[1] = (this._config.scorePlacementWiki * ((this.currentPlayerCap + 1) - this.playerFinishedCt));

            console.log('%s players are done', this.playerFinishedCt);

            if(thisPlayerProgress.articles.length < 10)
                thisPlayerProgress.scores[2] = this._config.scoreUnderClicksWiki;

            // Load results view for player
            this.Templates.Load('partials/player/wiki/results', thisPlayerProgress, (html) => {
                console.log (thisPlayerProgress);
                this._group_socket.to(playerSocketId).emit('wiki:results', html);

            });

            this._group_socket.to(this.group_id).emit('player:finished', this._current_players);

            // 1) Are we waiting for one player to reach target article after time expiry? 
            // 2) Have all players reached target
            // In either case, go right to results
            if (allPlayersFinished){
                this.StopCountdown();
                // console.log
            }

            if(this.waitingForFinish || allPlayersFinished)      
                this.DisplayResults();
        
        }

        allPlayerProgress[this._current_round][playerSocketId] = thisPlayerProgress;
        this.playerProgress = allPlayerProgress;


    }

    StartExcessCountdown() {

        if(this.excessCountdown)
            clearInterval(this.excessCountdown)

        this.excessDuration = 0;

        this.excessCountdown = setInterval(() => {

            this.excessDuration++;

        }, 1000);
    }

    ForceResults() {

        this.DisplayResults(true);

    }
    

};

module.exports = WikiLib;