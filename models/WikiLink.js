/**
 * Emerging Citizens
 * 
 * WikiLink Model
 * @module WikiLink
 * @class WikiLink
 * @author Johnny Richardson
 * 
 * For field docs: http://keystonejs.com/docs/database/
 *
 * ==========
 */
var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * WikiLink Model
 * ==========
 */

var WikiLink = new keystone.List('WikiLink', {
    nocreate: false, 
    track: true,
    autokey: { path: 'key', from: 'articleName', unique: true },
    map: { name: 'articleName' }
});

WikiLink.add({
	articleUrl: { type: String, label: 'Article Link', required: true, initial: true, index: true },
    articleName: { type: String, label: 'Destination Article Name', initial:true, required:true},
    articleImage: { type: Types.CloudinaryImage, label: "Destination Article Image"},
    articleDescription: { type: Types.Markdown, label: 'Destination Article Description', initial:true, required:true},
	category: {
        type: Types.Relationship,
        ref: 'ContentCategory',
        filters: { game: "WikiGeeks"},
        label: 'Category', 
        many: true
    }
});

/**
 * Registration
 */

WikiLink.defaultColumns = 'name, category, articleUrl';
WikiLink.register();
