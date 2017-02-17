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
var coreModule = require('learning-games-core'),
    Core = coreModule.Core,
    shuffle = coreModule.ShuffleUtil;

class WikiLib extends Core {

    constructor() {

        super();

        this.urlRandomArticle = 'https://en.wikipedia.org/w/api.php?format=json&action=query&format=json&list=random&rnnamespace=0&rnfilterredir=nonredirects&rnlimit=1',

        this.Links = this.keystone.list('WikiLink'),
        this.Topics = this.keystone.list('WikiTopic'),
        this.request = require('request'),

        this.allArticles = [],
        this.playerProgress = {},
        this.playersSubmitted = [],
        this.isSearching = false,
        this.checkSearching,

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
            let roundlimit = config.roundNumber;

            // Get topics for this game given selected categories
            this.Topics.model.find({ 'categoryName': { $in: gameSession.contentCategories } }, '_id', (err, topics) => {

                let topicIds = _.pluck(topics, 'id');
                let linksQuery = this.Links.model.find({ 'category': { $in: topicIds } }).populate('category');

                linksQuery.exec((err, links) => {
    
                    // Randomize links and cap at round limit
                    let linksRandom = _.sample(shuffle(links), roundlimit);

                    _.each (linksRandom, (link, index) => {

                        let contentCategory = link.category[Math.floor(Math.random() * link.category.length)];
                        // console.log(contentCategory)

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
                        
                    });

                });
                
            });

        });

    
    }

    AdvanceRound(socket) {

        // Attach submissions to game session in order to save progress to DB
        this._game_session.submissions = this.playerProgress;

        // Invoke common method
        super.AdvanceRound(socket);

        if(this._current_round === this._config.roundNumber)
        {
            this.End(socket);
            return;
        }

        this.playersSubmitted = [];
        this.playerFinishedCt = 0;
        this.waitingForFinish = false;

        this.DisplayTopic(socket);

    }

    Reset() {

        this.playerProgress = {};

        // Clear excess countdown if running
        if(this.excessCountdown)
            clearInterval(this.excessCountdown);

        // Invoke common method
        super.Reset();

    }

    PlayerRemove(player) { 

        console.log("player removed is " + player);

        // Remove player's current progress
        if (Object.keys(this.playerProgress).length > 1) {
            delete this.playerProgress[this._current_round][player.uid];
        } else {
            console.log("no player progress");
        }

        super.PlayerRemove(player);

    }

    StartGame(socket) {

        this._game_in_session = true;

        // First round
        this._current_round = 0;

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

        data.timeLimit = this._config.articleCooldown;
        data.countdownName = 'topicCountdown';

        // Load player search screen
        this.Templates.Load('partials/player/wiki/search', data, (html) => {

            socket.to(this.players_id).emit('game:start', html);

            this.SaveState('game:start', html);
        
        });

        // Load group topic screen
        this.Templates.Load('partials/group/wiki/topic', data, (html) => {

            // Start the game
            socket.to(this.group_id).emit('game:start', {html: html});
            
            // Begin topic reveal countdown and assign end event
            this.Countdown(socket, data);
            
            this.eventEmitter.once('countdownEnded', (data, socket) => {

               this.checkSearching = setInterval( () => { this.CheckIfBusy( () => { this.DisplayArticle() } ) }, 1000);
            
            });

        });

    }

    DisplayArticle(playerSocketId) {

        clearInterval(this.checkSearching);

        let data = this.allArticles[this._current_round];

        // Show topic info only after checking if all players have an article
        let playerChecked = _.after(this._current_player_cap, () => {
            
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
            // this.SaveState('topic:info', data);

            //load group templates
            this.Templates.Load('partials/group/wiki/article', data, (html) => {

                // if a player chose the destination article as their starting article...
                if (this.playerFinishedCt > 0) {
                    for (var i=0; i <= this.playersFinishedCt; i++){
                        // find the finished players
                        let finished = _.findWhere(this._current_players, { finished: true });
                        // send the finished player event to the group screen
                        this._group_socket.to(this.group_id).emit('player:finished', finished);
                    }
                }
                
                this._group_socket.to(this.group_id).emit('topic:info', {html: html, players: this.playerProgress[this._current_round]});
            
                // Begin countdown for players to reach article
                this.Countdown(this._group_socket, {countdownName: 'results'});

                this.eventEmitter.once('countdownEnded', (data, socket) => {
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
            else
                playerChecked();

        });

    }

    DisplayResults(force) {

        this._showing_results = true;

        // If no players have finished, don't continue, and wait until one player reaches target
        let playersFinished = _.some(this.playerProgress[this._current_round], function(player) { return _.has(player, "finished"); });

        if (!playersFinished && !force) {

            this.StartExcessCountdown();

            this._group_socket.to(this.group_id).emit('wiki:waiting');
            this.waitingForFinish = true;
            
            return;
        
        }
        
        // Cache val for if last round
        let lastRound = (this._current_round === this._config.roundNumber - 1);

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
                            last_round: lastRound,
                            survey: this._config.survey
                       };

            this.Templates.Load('partials/group/wiki/results', data, (html) => {

                this._group_socket.to(this.group_id).emit('wiki:results', html);
                this.SaveState('wiki:results', html);

            });

        });

        let loadPlayerResults = (data, playerId) => {
            
            if(lastRound) {
                data.last_round = true;
                data.survey = this._config.survey;
                data.surveyUrl = this._config.surveyUrl;
            }

            // Load results view for player
            this.Templates.Load('partials/player/wiki/results', data, (html) => {

                this._group_socket.to(playerId).emit('wiki:results', html);

                // Players has results
                playersHaveResults();

            });

        }

        // Move through each player's progress
        for(var playerUid in progress) {

            let thisPlayerProgress = progress[playerUid];
            let thisPlayer = this.GetPlayerByUserId(parseInt(playerUid));
            let articleIndex = 0;

            if(!thisPlayer)
                continue;

            // If article list length is over 24, modify second to last to say "....", move last article to 24th place, and limit array to 25
            if(thisPlayerProgress.articles.length > 24) {
                thisPlayerProgress.articles[23].title = "....";

                thisPlayerProgress.articles[24] = thisPlayerProgress.articles[thisPlayerProgress.articles.length-1];
                thisPlayerProgress.articles = thisPlayerProgress.articles.slice(0, 25);
            }

            thisPlayerProgress.username = thisPlayer.username;

            // Calc total score
            thisPlayerProgress.score_sum = _.reduce(thisPlayerProgress.scores, function(memo, num){ return memo + num; });

            // Set this player's total cumulative score
            if(!thisPlayer.score_total)
                thisPlayer.score_total = thisPlayerProgress.score_sum;
            else
                thisPlayer.score_total += thisPlayerProgress.score_sum;

            // Get number of clicks for player's progress
            thisPlayerProgress.clicks = thisPlayerProgress.articles.length;

            // If player never finished, set their time to the entire duration PLUS any excess and convert articles object to correct format
            if(!thisPlayerProgress.finished) {

                thisPlayerProgress.time = this._config.timeLimit + this.excessDuration;
                
                for(var ind in thisPlayerProgress.articles) {
                    
                    let title = thisPlayerProgress.articles[ind]
                    thisPlayerProgress.articles[ind] = {title: title};

                }

                loadPlayerResults(thisPlayerProgress, thisPlayer.socket_id);

            }
            else
                playersHaveResults();

            

        }

    }
    
    PlayerClick(playerSocketId, articleTitle, initialSearch) {

        // set isSearching to true while running
        this.isSearching = true;

        // Cache val for if last round
        let lastRound = (this._current_round === this._config.roundNumber - 1);

        articleTitle = articleTitle.toLowerCase();
        
        let thisPlayer = this.GetPlayerById(playerSocketId);

        if(!thisPlayer)
            return;

        // Tell group screen that a player has clicked
        this._group_socket.to(this.group_id).emit('wiki:click', thisPlayer);

        let playerSubmission = articleTitle.replace(/_/g, ' ');
        let allPlayerProgress = this.playerProgress;

        playerSubmission = decodeURIComponent('"' + playerSubmission + '"');
        playerSubmission = playerSubmission.toLowerCase();
        playerSubmission = playerSubmission.replace(/"/g, '');

        // Track all initial searches
        if(initialSearch) {

            // Return error if player manages to get to target on initial search
            if(playerSubmission === this.allArticles[this._current_round].articleName) {

                thisPlayer.submitted = false;
                this.isSearching = false;

                this._group_socket.to(playerSocketId).emit(
                    'article:tryagain', 
                    'Pssst...you managed to select the actual target article! That\'d make this too easy! Please try another article. (And hey, now you have a leg up!)'
                );
    
                return;

            } else 
                thisPlayer.submitted = true;
                
            let articleData = this.allArticles[this._current_round];
            _.extend(_.findWhere(this._current_players, {socket_id: playerSocketId}), thisPlayer);
            
            this.playersSubmitted.push(playerSocketId);

            if (this._countdown_duration > 6 && 
                this._countdown_duration !== this._config.timeLimit) {

                if(this.playersSubmitted.length === this._current_player_cap) {

                    // Stop topic countdown
                    this.StopCountdown();

                    // Initiate new countdown of 6s (we're fast-forwarding)
                    this.Countdown(this._group_socket, {timeLimit: 6, countdownName: 'topicCountdown'});
                    
                    // Display article in 6s
                    this.eventEmitter.once('countdownEnded', (data, socket) => {

                        this.checkSearching = setInterval( () => { this.CheckIfBusy( () => { this.DisplayArticle(playerSocketId) } ) }, 1000);

                    });
                    
                }
            }

            
    
        }

        if(!allPlayerProgress[this._current_round])
            allPlayerProgress[this._current_round] = {};

        if(!allPlayerProgress[this._current_round][thisPlayer.uid])
            allPlayerProgress[this._current_round][thisPlayer.uid] = { articles: [], scores: [0, 0, 0] };

        let thisPlayerProgress = allPlayerProgress[this._current_round][thisPlayer.uid];
        
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

            // Clear excess countdown if running
            if(this.excessCountdown)
                clearInterval(this.excessCountdown);

            // Get count of all other players done and add this one
            this.playerFinishedCt++;
            let allPlayersFinished = (this.playerFinishedCt === this._current_player_cap);

            thisPlayerProgress.finished = true;
            thisPlayerProgress.username = thisPlayer.username;

            // Use time limit + excess if we've gone past time expiry
            if(!this.waitingForFinish)
                thisPlayerProgress.time = (this._config.timeLimit - this._countdown_duration);
            else 
                thisPlayerProgress.time = (this._config.timeLimit + this.excessDuration);

            // Get number of clicks
            thisPlayerProgress.clicks = thisPlayerProgress.articles.length;

            // Get scores based on config values
            // 0: bonus score
            // 1: placement score based on where player is in line of finishers
            thisPlayerProgress.scores[0] = this._config.scoreTargetReached;
            thisPlayerProgress.scores[1] = (this._config.scorePlacement * ((this._current_player_cap + 1) - this.playerFinishedCt));

            if(thisPlayerProgress.articles.length < 10)
                thisPlayerProgress.scores[2] = this._config.scoreUnderClicks;

            let i = -1;
            // Create a display index for each article (from 0-9) to help display article path
            for(var ind in thisPlayerProgress.articles) {
                if(i > 8)
                    i = 0;
                else 
                    i++;
                
                let title = thisPlayerProgress.articles[ind]
                thisPlayerProgress.articles[ind] = {display_index: i};

                // 'title' needs to be mutable
                Object.defineProperty(thisPlayerProgress.articles[ind], 'title',
                                         {writable: true, value: title}
                                     );
            }

            
            // Load results view for player
            if(lastRound) {
                thisPlayerProgress.last_round = true;
                thisPlayerProgress.survey = this._config.survey;
                thisPlayerProgress.surveyUrl = this._config.surveyUrl;
            }

            this.Templates.Load('partials/player/wiki/results', thisPlayerProgress, (html) => {
                this._showing_results = true;
                this._group_socket.to(playerSocketId).emit('wiki:results', html);

            });

            this._group_socket.to(this.group_id).emit('player:finished', thisPlayer);
            this._group_socket.to(this.players_id).emit('player:finished');

            // 1) Are we waiting for one player to reach target article after time expiry? 
            // 2) Have all players reached target?
            // In either case, go right to results
            if (allPlayersFinished)
                this.StopCountdown();

            if(this.waitingForFinish || allPlayersFinished)
                this.DisplayResults();
        
        }

        this.isSearching = false;

        // Tell player the submission is valid
        this._group_socket.to(playerSocketId).emit('article:valid', {initial: initialSearch});
        // this.SaveState('article:valid', {initial:initialSearch});


        allPlayerProgress[this._current_round][thisPlayer.uid] = thisPlayerProgress;
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

    // Check if a player is still waiting for an article search to finish
    // and if so wait an additional second
    CheckIfBusy(callback) {

        if (this.isSearching)
            return;
        else
            setTimeout(callback, 1000);

    }
    

};

module.exports = WikiLib;