/**
 * Emerging Citizens
 * 
 * MemeGame Model
 * @module models
 * @class MemeGame
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
 * MemeGame Model
 * ==========
 */

var MemeGame = new keystone.List('MemeGame', {
    inherits: GameSession,
    track: true
});

MemeGame.add({

  contentCategories: { type: keystone.Field.Types.Relationship, ref: 'ContentCategory', many: true },
  roundData: { type: Types.Relationship, ref: 'MemeTopic' }

});

/**
 * Registration
 */

// MemeGame.defaultColumns = 'contentCategories';
MemeGame.register();
