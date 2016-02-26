/**
 * Emerging Citizens
 * 
 * Tweet Model
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
 * Tweet Model
 * ==========
 */

var Tweet = new keystone.List('Tweet');

Tweet.add({
	name: { type: String, label: 'ref name', required: true, initial: true, index: true },
	tweetId: { type: Types.Url, label: 'Tweet ID', required: true, initial: true }
});

/**
 * Registration
 */

Tweet.defaultColumns = 'name';
Tweet.register();
