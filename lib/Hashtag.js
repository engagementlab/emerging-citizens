/**
 * Emerging Citizens
 * Developed by Engagement Lab, 2016
 * ==============
 * Hashtag You're It game controller
 *
 * @class Hashtag
 * @static
 * @author Johnny Richardson
 *
 * ==========
 */
var keystone = require('keystone'),
    _ = require('underscore'),
    randomize = require('randomize-obj'),
    TemplateLoader = new require('./TemplateLoader');

module.exports = function(gameSession) {

    var _SOCKET;
    var _SESSION = gameSession;
    var _PLAYERS = {};
    var _HASHTAGS = {};
    var _REAL_HASHTAG;

    this.Events = function(EventEmitter) {
      
        EventEmitter.on('playerReady', function() {


        });

    };

    this.End = function(socket) {

        console.log('ending game')

        socket.to(_SESSION.accessCode).emit('game:end');

        delete _GAME_SESSIONS.gameSession;
        
    };

    this.PlayerReady = function(player, socket) {

        _PLAYERS[player.id] = player.username;

        if(Object.keys(_PLAYERS).length === _SESSION.playerCap) {
          require('./Tweet')(
            '695343359607468034', 
            function(data) {

                // Cache the real hashtag
                _REAL_HASHTAG = data.hashtag;

                TemplateLoader('index/tweet', data.tweet, function(html) {
                  socket.to(_SESSION.accessCode).emit('game:start', html);
                });

                TemplateLoader('moderator/waiting', data.tweet, function(html) {
                  socket.to(_SESSION.accessCode + '-moderator').emit('game:start', html);
                });
              
            });

        }

        socket.to(_SESSION.accessCode).emit('players:update', _PLAYERS);
        socket.to(_SESSION.accessCode + '-moderator').emit('players:update', _PLAYERS);

    };

    this.PlayerLost = function(player, socket) {

        delete _PLAYERS[player];

        console.log('left', player);

        socket.to(_SESSION.accessCode).emit('players:update', _PLAYERS);

    };

    this.HashtagSubmitted = function(player, submission, socket) {

        _HASHTAGS[player] = submission;

        // All hashtags received
        if(Object.keys(_HASHTAGS).length === _SESSION.playerCap) {

            _HASHTAGS["moderator"] = _REAL_HASHTAG;
            
            // Randomize the hashtag order
            randomize(_HASHTAGS);

            socket.to(_SESSION.accessCode).emit('hashtags:received', _HASHTAGS);
            socket.to(_SESSION.accessCode + '-moderator').emit('hashtags:received', _HASHTAGS);

        }

    };

};