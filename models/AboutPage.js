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
    text: { type: Types.Markdown, label: 'About Text', required: true, initial: true }, 
    research: { type: Types.Markdown, label: 'Research Rational', required: true, initial: true }
});

/**
 * Registration
 */
 AboutPage.defaultColumns = 'name';
 AboutPage.register();
