/**
 * Emerging Citizens
 * 
 * HashtagGame Model
 * @module models
 * @class HashtagGame
 * @author Johnny Richardson
 * 
 * For field docs: http://keystonejs.com/docs/database/
 *
 * ==========
 */
var keystone = require('keystone');
var GameSession = require('./GameSession');
var Types = keystone.Field.Types;

/**
 * HashtagGame Model
 * ==========
 */

var HashtagGame = new keystone.List('HashtagGame', {
    inherits: GameSession,
    track: true
});

HashtagGame.add({

  hashtagIds: { type: Types.TextArray, required: true, initial: true }

});

/**
 * Registration
 */

HashtagGame.defaultColumns = 'name';
HashtagGame.register();
