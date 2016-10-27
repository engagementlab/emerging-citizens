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
// var Tweet = require('./Tweet');
var Types = keystone.Field.Types;

/**
 * HashtagGame Model
 * ==========
 */

var WikiGame = new keystone.List('WikiGame', {
    inherits: GameSession,
    track: true
});

WikiGame.add({

  contentCategories: { type: keystone.Field.Types.Relationship, ref: 'ContentCategory', many: true },
  // roundData: { type: Array }

  roundData: { type: Types.Relationship, ref: 'WikiLink' }

});

// Store all hashtag submissions/votes (not visible in admin UI)
WikiGame.schema.add({ submissions: Object });

/**
 * Registration
 */

// WikiGame.defaultColumns = 'contentCategories';
WikiGame.register();
