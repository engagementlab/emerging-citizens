/**
 * Emerging Citizens
 * 
 * GameGameUser Model
 * @module tweet
 * @class tweet
 * @author Johnny Richardson
 * 
 * For field docs: http://keystonejs.com/docs/database/
 *
 * ==========
 */
 var keystone = require('keystone');
 var Types = keystone.Field.Types;

/**
 * GameUser Model
 * ==========
 */

var GameUser = new keystone.List('GameUser');

GameUser.add({
	name: { type: String, required: true, index: true } 
});



/**
 * Registration
 */

GameUser.defaultColumns = 'name';
GameUser.register();
