/**
 * Emerging Citizens
 * 
 * AboutPage Model
 * @module homepage
 * @class homepage
 * @author Johnny Richardson
 * 
 * For field docs: http://keystonejs.com/docs/database/
 *
 * ==========
 */
var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * AboutPage Model
 * ==========
 */

var AboutPage = new keystone.List('AboutPage', {
    
    label: 'About Page Content',
    singular: 'About Page Content',
    nodelete: true

});

AboutPage.add({
    
    name: { type: String, default: 'About Page', hidden: true },
    top_text: { type: Types.Markdown, label: 'About Text Title', required: true, initial: true }, 
    research: { type: Types.Markdown, label: 'About Text - Research Rationale', required: true, initial: true }, 
    image: { type: Types.CloudinaryImage, label: "Big Image"}, 
    bottom_text: { type: Types.Markdown, label: 'Title Text at bottom of page'}

}, 
		'Features', {
			what_text: { type: Types.Markdown, label: 'Features Title Text' }, 
			no_downloads: { type: Types.Markdown, label: 'No downloads paragraph', note: "Make sure to make title of paragraph a H2 element"}, 
			no_downloads_img: { type: Types.CloudinaryImage, label: "No Downloads Image"}, 
			three_games: { type: Types.Markdown, label: 'Three Games, Three Modalities Paragraph', note: "Make sure to make title of paragraph a H2 element"}, 
			three_games_img: { type: Types.CloudinaryImage, label: "Step Two Image"}, 
			lesson_guides: { type: Types.Markdown, label: 'Lesson Guides Paragraph', note: "Make sure to make title of paragraph a H2 element"}, 
			lesson_guides_img: { type: Types.CloudinaryImage, label: "Lesson Guides Image"}

});

/**
 * Registration
 */
 AboutPage.defaultColumns = 'name';
 AboutPage.register();
