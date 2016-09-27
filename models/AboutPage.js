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
    text: { type: Types.Markdown, label: 'Text', required: true, initial: true }
  //   htyi_blurb: { type: Types.Markdown, label: 'HTYI Blurb', required: true, initial: true },
  //   wwdmm_blurb: { type: Types.Markdown, label: 'WWDMM Blurb', required: true, initial: true },
		// wiki_blurb: { type: Types.Markdown, label: 'Wiki Blurb', required: true, initial: true }

});

/**
 * Registration
 */
 AboutPage.defaultColumns = 'name';
 AboutPage.register();
