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

  hashtagIds: { type: Types.TextArray, required: true, initial: true, default: ["695343359607468034", "710485519931670528", "710484983807397888", "710481070328844290", "710483639801421824"] }

});

/**
 * Registration
 */

HashtagGame.defaultColumns = 'name';
HashtagGame.register();
