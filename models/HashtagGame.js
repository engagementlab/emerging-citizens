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
var Tweet = require('./Tweet');
var Types = keystone.Field.Types;

/**
 * HashtagGame Model
 * ==========
 */

var HashtagGame = new keystone.List('HashtagGame', {
    inherits: GameSession,
    track: true,
    hidden: true
});

HashtagGame.add({

  contentCategories: { type: Types.Relationship, ref: 'ContentCategory', many: true },
  // roundData: { type: Array }
  tweets: { type: Types.Relationship, ref: 'Tweet', many: true }

});

// Store all hashtag submissions/votes (not visible in admin UI)
HashtagGame.schema.add({ submissions: Object });

/**
 * Registration
 */

HashtagGame.defaultColumns = 'name';
HashtagGame.register();
