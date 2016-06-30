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

        this.Links = this.keystone.list('WikiLinks'),

        // HTTP requester
        this.request = require('request'),

        this._current_round,
        // this._votes = 0,

        this._all_articles = [],

        this.currentPlayerIndex = 0;

    }

    Initialize(gameSession) {
        
        // Invoke common method
        super.Initialize(gameSession, (config) => {
            this._config = config;
            console.log (this._config, "wiki config");


            // Content buckets for this session
            this.Links.model.find({}, (err, result) => {
                // console.log (result, "results");
                var roundlimit = config.roundNumberWiki;
                // console.log (roundlimit, "round limit");
                // Randomize topics
                let topics = shuffle(result);
                // console.log (topics, "shuffled topics");

                topics = _.sample(topics, roundlimit);
                // console.log (topics, "sampled topics");

                _.each (topics, (topic, index) => {

                    var topicName = topic.category.topicName;
                    var topicImage = topic.category.topicImage;
                    var topicDescription = topic.category.topicDescription.html;
                    var article = topic.articleName;
                    var articleImage = topic.articleImage;
                    var articleDescription = topic.articleDescription.html;
                    
                    this._all_articles.push ({ "topicName": topicName, "topicImage" : topicImage,  "topicDescription" : topicDescription, "article" : article, "articleDescription" : articleDescription, "articleImage" : articleImage });
               
                });

                console.log (this._all_articles, "all articles");
                
                // // Save link IDs to the model's 'links' key and then cache all link data for this session
                // this._game_session.topics = this._all_articles;
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

    };
 
    DisplayTopic(articleIndex, socket) {
        
        // console.log (this._all_articles, "all articles");
        var data = this._all_articles[articleIndex];
        var playerCount = Object.keys(this._currentPlayers).length;
        // console.log (playerCount, "playercount");
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
                       // console.log (data.players, "data.players");

        this.Templates.Load('partials/player/wiki/search', data, (html) => {

            socket.to(this.players_id).emit('game:start', html);
            this.SaveState('game:start', html);
        
        });

        this.Templates.Load('partials/group/wiki/topic', data, (html) => {
            
            socket.to(this.group_id).emit('game:start', html);
            // console.log (socket, "socket");
        
            // Begin first countdown and assign end event
            let args = [data, socket];
            this.Countdown(socket, this.DisplayArticle, args);
            // this._event_countdown_done = ;
            

        });

    }

    DisplayArticle(data, socket) {
        console.log (data, "data", "displaying article");

        var playerCount = Object.keys(this._currentPlayers).length;
        var data = data;

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

            socket.to(this.players_id).emit('game:start', html);
            this.SaveState('game:start', html);
        
        });

        this.Templates.Load('partials/group/wiki/article', data, (html) => {
            
            socket.to(this.group_id).emit('game:start', html);
        
            // Begin first countdown and assign end event
            // this.Countdown(socket);
            // this._event_countdown_done = this.StartLinking;

        });

    }

    SearchArticles(socket, playerQuery) {

        var apiUrl = 'https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&titles=' + playerQuery.replace(/ /g, "_");

        console.log(apiUrl)
        this.request(
            apiUrl,
            (error, response, body) => {
     
                if (!error && response.statusCode == 200) {
                    
                    let bodyJson = JSON.parse(body);
                    let articleIndex = Object.keys(bodyJson.query.pages)[0];
                    let articleExtract = bodyJson.query.pages[articleIndex].extract;
    
                    this.Templates.Load('partials/player/wiki/article', {html: articleExtract}, (html) => {

                        socket.emit('article:found', html);
                    
                    });

                }

            }
        );

    }
    
    StartingArticleSubmitted(playerSocketId, submission, socket, space) {

        // If player has submitted the real hashtag, ask them to try again
        if(submission === undefined || submission.length === 0) {
            socket.emit('article:tryagain', 'You need to choose a starting article!');
            return;
        }

        // All hashtags should be lower case and not include #
        let thisArticle = submission;
        let thisPlayer = this.GetPlayerById(playerSocketId);

        if(thisPlayer === undefined)
            throw new Error("Player with socket_id '" + playerSocketId + "' NOT found!");
        
        // If player has submitted the real hashtag, ask them to try again
        let realMatch = new RegExp("\\b" + this._real_hashtag + "\\b").test(thisHashtag);
        if(realMatch) {
            socket.emit('article:tryagain', 'That page does not exist! Please try again.');
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
            this.StartLinking(space);

    }

};

module.exports = WikiLib;