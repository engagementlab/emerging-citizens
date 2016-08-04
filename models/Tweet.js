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
	name: { type: String, label: 'Reference Name', required: true, initial: true, index: true },
	tweetText: { type: Types.Markdown, label: 'Tweet Text', required: true, initial: true },
	hashtag: { type: String, label: 'Hashtag', required: true, initial: true },
	category: {
        type: Types.Relationship,
        ref: 'ContentCategory',
        label: 'Category',
        required: true,
        initial: true,
        many: true
    }
});

/**
 * Registration
 */

Tweet.defaultColumns = 'name, hashtag, category';
Tweet.register();
