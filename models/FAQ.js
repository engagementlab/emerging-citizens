/**
 * Emerging Citizens
 * 
 * FAQ Model
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
 * FAQ Model
 * ==========
 */

var FAQ = new keystone.List('FAQ', {
    
    label: 'FAQs',
    singular: 'FAQ',
    nodelete: false, 
    sortable: true
    // autoKey: { path: 'faq_key', from: 'name', unique: true}

});

FAQ.add({
    name: { type: String, default: 'FAQ', hidden: true },
    question: { type: Types.Markdown, label: 'Question', required: true, initial: true }, 
    answer: { type: Types.Markdown, label: 'Answer', required: true, initial: true }, 
    enabled: { type: Types.Boolean, label: 'Enabled?', default: true }
});

FAQ.schema.pre('save', function(next) {

     this.name = this.question.md.replace(/ /g, '-').replace(/\./g, '').replace(/\?/g, '').replace(/\,/g, '');

     console.log (this.name, "name");

    next();

});

/**
 * Registration
 */
 FAQ.defaultColumns = 'name, question';
 FAQ.register();
