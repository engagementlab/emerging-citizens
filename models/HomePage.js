/**
 * Emerging Citizens
 * 
 * HomePage Model
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
 * HomePage Model
 * ==========
 */

var HomePage = new keystone.List('HomePage', {

    label: 'Home Page',
    singular: 'Home Page',
    nodelete: true

});

HomePage.add({

        name: {
            type: String,
            default: 'Home Page Content',
            hidden: true
        },
        intro: {
            type: Types.Markdown,
            label: 'Intro Text',
            required: true,
            initial: true
        },
        mailing_link: {
            type: Types.Url,
            label: 'Mailing List URL',
            required: true,
            initial: true
        },
        htyi_blurb: {
            type: Types.Markdown,
            label: 'HTYI Blurb',
            required: true,
            initial: true,
            note: 'Must be under 200 characters.'
        },
        htyi_image: {
            type: Types.CloudinaryImage,
            label: 'HTYI Image',
            note: "Images should be in square format to display properly",
            folder: 'emerging-citizens/images/layout/home/landing',
            autoCleanup: true
        },
        wwdmm_blurb: {
            type: Types.Markdown,
            label: 'WWDMM Blurb',
            required: true,
            initial: true,
            note: 'Must be under 200 characters.'
        },
        wwdmm_image: {
            type: Types.CloudinaryImage,
            label: 'WWDMM Image',
            note: "Images should be in square format to display properly",
            folder: 'emerging-citizens/images/layout/home/landing',
            autoCleanup: true
        },
        wiki_blurb: {
            type: Types.Markdown,
            label: 'Wiki Blurb',
            required: true,
            initial: true,
            note: 'Must be under 200 characters.'
        },
        wiki_image: {
            type: Types.CloudinaryImage,
            label: 'Wiki Image',
            note: "Images should be in square format to display properly",
            folder: 'emerging-citizens/images/layout/home/landing',
            autoCleanup: true
        }
    },

    'What is Emerging Citizens', {
        what_text: {
            type: Types.Markdown,
            label: 'Title Text'
        },
        no_downloads: {
            type: Types.Markdown,
            label: 'No downloads paragraph',
            note: "Make sure to make title of paragraph a H2 element"
        },
        no_downloads_img: {
            type: Types.CloudinaryImage,
            label: "No Downloads Image",
            note: "Images should be in square format to display properly",
            folder: 'emerging-citizens/images/layout/home/landing',
            autoCleanup: true
        },
        three_games: {
            type: Types.Markdown,
            label: 'Three Games, Three Modalities Paragraph',
            note: "Make sure to make title of paragraph a H2 element"
        },
        three_games_img: {
            type: Types.CloudinaryImage,
            label: "Three Games, Three Modalitites Image",
            note: "Images should be in square format to display properly",
            folder: 'emerging-citizens/images/layout/home/landing',
            autoCleanup: true
        },
        lesson_guides: {
            type: Types.Markdown,
            label: 'Lesson Guides Paragraph',
            note: "Make sure to make title of paragraph a H2 element"
        },
        lesson_guides_img: {
            type: Types.CloudinaryImage,
            label: "Lesson Guides Image",
            note: "Images should be in square format to display properly",
            folder: 'emerging-citizens/images/layout/home/landing',
            autoCleanup: true
        }

    },

    'How The Platform Works', {
        rationale: {
            type: Types.Markdown,
            label: 'Blurb about how to play'
        },
        step_one: {
            type: Types.Markdown,
            label: 'Step One Paragraph'
        },
        step_one_img: {
            type: Types.CloudinaryImage,
            label: "Step One Image",
            note: "Images should be in square format to display properly",
            folder: 'emerging-citizens/images/layout/home/landing',
            autoCleanup: true
        },
        step_one_group: {
            type: Types.Markdown,
            label: 'Step One - Group Screen Info'
        },
        step_one_player: {
            type: Types.Markdown,
            label: 'Step One - Player Screen Info'
        },
        step_two: {
            type: Types.Markdown,
            label: 'Step Two Paragraph'
        },
        step_two_img: {
            type: Types.CloudinaryImage,
            label: "Step Two Image",
            note: "Images should be in square format to display properly",
            folder: 'emerging-citizens/images/layout/home/landing',
            autoCleanup: true
        },
        step_three: {
            type: Types.Markdown,
            label: 'Step Three Paragraph'
        },
        step_three_img: {
            type: Types.CloudinaryImage,
            label: "Step Three Image",
            note: "Images should be in square format to display properly",
            folder: 'emerging-citizens/images/layout/home/landing',
            autoCleanup: true
        },
        step_four: {
            type: Types.Markdown,
            label: 'Step Four Paragraph'
        },
        step_four_img: {
            type: Types.CloudinaryImage,
            label: "Step Four Image",
            folder: 'emerging-citizens/images/layout/home/landing',
            autoCleanup: true
        },
        step_five: {
            type: Types.Markdown,
            label: 'Step Five Paragraph'
        },
        step_five_img: {
            type: Types.CloudinaryImage,
            label: "Step Five Image",
            folder: 'emerging-citizens/images/layout/home/landing',
            autoCleanup: true
        },
        final_info: {
            type: Types.Markdown,
            label: 'Final Step Paragraph'
        },
        final_info_img: {
            type: Types.CloudinaryImage,
            label: "Final Step Image",
            note: "Images should be in square format to display properly",
            folder: 'emerging-citizens/images/layout/home/landing',
            autoCleanup: true
        }
    },

    'Design and Development Team', {
        people: {
            type: Types.Markdown,
            label: 'Credits',
            note: 'Each person should be a list item'
        },
    });

/**
 * Registration
 */
HomePage.defaultColumns = 'name';
HomePage.register();