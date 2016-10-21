/**
 * Emerging Citizens
 * 
 * ComingSoon Model
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
 * ComingSoon Model
 * ==========
 */

var ComingSoon = new keystone.List('ComingSoon', {
    
    label: 'Coming Soon Content',
    singular: 'Coming Soon Content',
    nodelete: true

});

ComingSoon.add({
    
    name: { type: String, default: 'Coming Soon Content', hidden: true },
    intro: { type: Types.Markdown, label: 'Intro Text', required: true, initial: true },
    mailing_link: { type: Types.Url, label: 'Mailing List URL', required: true, initial: true },
    htyi_blurb: { type: Types.Markdown, label: 'HTYI Blurb', required: true, initial: true },
    wwdmm_blurb: { type: Types.Markdown, label: 'WWDMM Blurb', required: true, initial: true },
		wiki_blurb: { type: Types.Markdown, label: 'Wiki Blurb', required: true, initial: true }

});

/**
 * Registration
 */
 ComingSoon.defaultColumns = 'name';
 ComingSoon.register();
