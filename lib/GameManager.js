/**
 * Emerging Citizens
 * Developed by Engagement Lab, 2016
 * ==============
 * Game manager.
 *
 * @class lib
 * @static
 * @author Johnny Richardson
 *
 * ==========
 */

var GameManager = function(EventEmitter) {

    EventEmitter.on('loggedIn', function(msg) {
      console.log(msg);
    });

};

module.exports = GameManager;