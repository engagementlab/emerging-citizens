/**
 * Emerging Citizens
 * 
 * GameConfig Model
 * @module models
 * @class GameConfig
 * @author Johnny Richardson
 * 
 * For field docs: http://keystonejs.com/docs/database/
 *
 * ==========
 */
var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * GameConfig Model
 * ==========
 */

var GameConfig = new keystone.List('GameConfig', {
		label: 'HTYI Config',
    track: true,
    candelete: false
});

GameConfig.add({

	name: { type: String, required: true, default: "Global Game Config" },
	roundNumber: { type: Number, label: "Number of Rounds", required: true, initial: true }

});

/**
 * Registration
 */

GameConfig.defaultColumns = 'name';
GameConfig.register();
