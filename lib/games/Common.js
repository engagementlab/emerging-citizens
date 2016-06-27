function Common() {

    this._ = require('underscore'),
    this.logger = require('winston'),

    this.Templates = require('../TemplateLoader'),
    this.Session = require('../SessionManager'),

    this._currentPlayers = {},
    this._GAME_SESSION,
    this._CONFIG = {},

    // Stores last event sent and its data
    this._objLastTemplate,
    this._strLastEventId,

    // Identifies targets for socket events
    this.PLAYERS_ID,
    this.GROUP_ID,
    this.keystone = require('keystone');

}
   
Common.prototype = { 

    GetPlayerById: function(id) {
        return _.findWhere(_currentPlayers, {socket_id: id});
    },

    // Is username a player entered available?
    UsernameAvailable: function(name) {

    return (_.where(_currentPlayers, {username: name}).length === 0);

    }

};

// Is user whose UID is provided still active?
Common.prototype.PlayerIsActive = function(uid) {

    return _currentPlayers[uid] !== undefined;

};

// Is game full of players?
Common.prototype.IsFull = function() {

    return (Object.keys(_currentPlayers).length === 8)

};

Common.prototype.PlayerReady = function(player, socket) {

    // If player is re-connecting, set them back to connected, and re-broadcast the last update
    if(_currentPlayers[player.uid] !== undefined)
    {
        _currentPlayers[player.uid].connected = true;
        _currentPlayers[player.uid].socket_id = player.socket_id;

        console.info(player.username + ' has re-joined the game and has uid ' + player.uid); 

        socket.emit(lastEventId, lastTemplate);
    }
    else {

        _currentPlayers[player.uid] = { 
                                    username: player.username, 
                                    socket_id: player.socket_id, 
                                    index: currentPlayerIndex, 
                                    submitted: false, 
                                    connected: true
                                };

        console.info(player.username + ' has joined the game and has uid ' + player.uid);

        currentPlayerIndex++;

        socket.to(GROUP_ID).emit('players:update', _currentPlayers);

    }

};

Common.prototype.PlayerLost = function(playerSocketId, socket) {

    var thisPlayer = GetPlayerById(playerSocketId)

    if(thisPlayer === undefined)
        return;

    thisPlayer.connected = false;

    console.info(thisPlayer.username + ' has left the game. Waiting for re-join.');

    setTimeout(function () {
        if (!thisPlayer.connected) {

            delete thisPlayer;

            socket.to(GROUP_ID).emit('players:update', _currentPlayers);

            // Decrease current # of players
            currentPlayerCap = Object.keys(_currentPlayers).length;

            if(Object.keys(_currentPlayers).length === 0)
                Reset();

        }
    }, 15000);

};


Common.prototype.Initialize = function(gameSession) {

        var GameConfig = this.keystone.list('GameConfig').model;

        // Init session
        _GAME_SESSION = gameSession;

        // Identify targets for socket events
        PLAYERS_ID = _GAME_SESSION.accessCode,
        GROUP_ID = _GAME_SESSION.accessCode + '-group';
    
        // Get config for HTYI game
        var queryConfig = GameConfig.findOne({}, {}, {
            sort: {
                'createdAt': -1
            }
        });
        queryConfig.exec(function(err, resultConfig) {

            _CONFIG = resultConfig;

        });

        console.info(_GAME_SESSION.accessCode + 'Game "' + _GAME_SESSION.accessCode + '" started! ');
    
    };

// Game ended
Common.prototype.End = function(socket, noTimeout) {

    if(noTimeout === undefined || !noTimeout) {

        var timeoutTime = 30;

        console.info('Game "' + _GAME_SESSION.accessCode + '" is timing out! ');

        _GAME_TIMEOUT = setInterval(function() {

            timeoutTime--;

            if(timeoutTime === 0) {

                clearInterval(_GAME_TIMEOUT);
                    
                Reset();
                Session.Delete(PLAYERS_ID);

                Templates.Load('partials/player/gameended', undefined, function(html) {
                    socket.to(PLAYERS_ID).emit('game:ended', html);
      
                    lastTemplate = html;
                    lastEventId = 'game:ended';
                });


            }
            else {

                // Dispatch countdown for game timeout
                Templates.Load('partials/player/gameending', {time: timeoutTime}, function(html) {
                    socket.to(PLAYERS_ID).emit('game:ending', html);
      
                    lastTemplate = html;
                    lastEventId = 'game:ending';
                });

            }
        
        }, 1000);

    }
    else {

        Reset();
        Session.Delete(PLAYERS_ID);

        // Dispatch countdown for game timeout
        Templates.Load('partials/player/gameended', {time: timeoutTime}, function(html) {
            socket.to(PLAYERS_ID).emit('game:ended', html);
      
            lastTemplate = html;
            lastEventId = 'game:ended';
        });


    }
    
};

module.exports = Common;