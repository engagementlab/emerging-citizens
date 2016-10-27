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
    image: { type: Types.CloudinaryImage, label: "Big Image", note: "Images should be in square format to display properly"}, 
    bottom_text: { type: Types.Markdown, label: 'Title Text at bottom of page'}

}, 
		'Features', {
			title_text: { type: Types.Markdown, label: 'Features Title Text' }, 
			feat_one: { type: Types.Markdown, label: 'Feature one paragraph', note: "Make sure to make title of paragraph a H2 element"}, 
			feat_one_img: { type: Types.CloudinaryImage, label: "Feature One Image", note: "Images should be in square format to display properly"}, 
			feat_two: { type: Types.Markdown, label: 'Feature Two Paragraph', note: "Make sure to make title of paragraph a H2 element"}, 
			feat_two_img: { type: Types.CloudinaryImage, label: "Feature Two Image", note: "Images should be in square format to display properly"}, 
			feat_three: { type: Types.Markdown, label: 'Feature Three Paragraph', note: "Make sure to make title of paragraph a H2 element"}, 
			feat_three_img: { type: Types.CloudinaryImage, label: "Feature Three Image", note: "Images should be in square format to display properly"}, 
			feat_four: { type: Types.Markdown, label: 'Feature Four Paragraph', note: "Make sure to make title of paragraph a H2 element"}, 
			feat_four_img: { type: Types.CloudinaryImage, label: "Feature Four Image", note: "Images should be in square format to display properly"}

});

/**
 * Registration
 */
 AboutPage.defaultColumns = 'name';
 AboutPage.register();
