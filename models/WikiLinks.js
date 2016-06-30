/**
 * Emerging Citizens
 * 
 * WikiLinks Model
 * @module WikiLinks
 * @class WikiLinks
 * @author Johnny Richardson
 * 
 * For field docs: http://keystonejs.com/docs/database/
 *
 * ==========
 */
var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * WikiLinks Model
 * ==========
 */

var WikiLinks = new keystone.List('WikiLinks', {
    nocreate: false, 
    track: true
});

WikiLinks.add({
	articleUrl: { type: String, label: 'Article Link', required: true, initial: true, index: true },
    articleName: { type: Types.Markdown, label: 'Destination Article Name', initial:true, required:true},
    articleDescription: { type: Types.Markdown, label: 'Destination Article Description', initial:true, required:true},
	category: {
            type: Types.Relationship,
            ref: 'ContentCategory',
            filter: { game: "WikiGeeks"},
            required: true,
            initial: true,
            label: 'Category'
        }
});

/**
 * Registration
 */

WikiLinks.defaultColumns = 'category, articleUrl, articleName';
WikiLinks.register();
