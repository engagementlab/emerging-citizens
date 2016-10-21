/**
 * Emerging Citizens
 * 
 * ComingSoon Model
 * @module comingsoon
 * @class comingsoon
 * @author Johnny Richardson
 * 
 * For field docs: http://keystonejs.com/docs/database/
 *
 * ==========
 */
var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * ComingSoon Model
 * ==========
 */

var ComingSoon = new keystone.List('ComingSoon', {
    
    label: 'Coming Soon',
    singular: 'Coming Soon',
    nodelete: true

});

ComingSoon.add({
    
    name: { type: String, default: 'Home Page Content', hidden: true },
    intro: { type: Types.Markdown, label: 'Intro Text', required: true, initial: true },
    mailing_link: { type: Types.Url, label: 'Mailing List URL', required: true, initial: true },
    htyi_blurb: { type: Types.Markdown, label: 'HTYI Blurb', required: true, initial: true },
    wwdmm_blurb: { type: Types.Markdown, label: 'WWDMM Blurb', required: true, initial: true },
		wiki_blurb: { type: Types.Markdown, label: 'Wiki Blurb', required: true, initial: true }
}, 

	'How The Platform Works', {
			rationale: { type: Types.Markdown, label: 'Blurb about how to play' }, 
			step_one: { type: Types.Markdown, label: 'Step One Paragraph'}, 
			step_one_img: { type: Types.CloudinaryImage, label: "Step One Image"}, 
			step_two: { type: Types.Markdown, label: 'Step Two Paragraph'}, 
			step_two_img: { type: Types.CloudinaryImage, label: "Step Two Image"}, 
			step_three: { type: Types.Markdown, label: 'Step Three Paragraph'}, 
			step_three_img: { type: Types.CloudinaryImage, label: "Step Three Image"}, 
			step_four: { type: Types.Markdown, label: 'Step Four Paragraph'}, 
			step_four_img: { type: Types.CloudinaryImage, label: "Step Four Image"}, 
			step_five: { type: Types.Markdown, label: 'Step Five Paragraph'}, 
			step_five_img: { type: Types.CloudinaryImage, label: "Step Five Image"}, 
			final_info: { type: Types.Markdown, label: 'Final Step Paragraph'}, 
			final_info_img: { type: Types.CloudinaryImage, label: "Final Step Image"}
}, 

'What is Emerging Citizens', {
			what_text: { type: Types.Markdown, label: 'Title Text' }, 
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
 ComingSoon.defaultColumns = 'name';
 ComingSoon.register();
