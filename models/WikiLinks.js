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
	// name: { type: String, label: 'Reference Name', required: true, initial: true, index: true },
	// topic: { type: Types.Relationship, label: 'General Topic', required: true, initial: true },
	destinationLinks: { type: Types.TextArray, label: 'Destination Links'},
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

WikiLinks.defaultColumns = 'category, destinationLinks';
WikiLinks.register();
