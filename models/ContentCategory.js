/**
 * Emerging Citizens
 * 
 * ContentCategory Model
 * @module models
 * @class ContentCategory
 * @author Johnny Richardson
 * 
 * For field docs: http://keystonejs.com/docs/database/
 *
 * ==========
 */
var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * ContentCategory Model
 * ==========
 */

var ContentCategory = new keystone.List('ContentCategory', {
    track: true
});

ContentCategory.add({

  name: { type: String, required: true, initial: true, label: "Category Name" }

});

/**
 * Registration
 */

ContentCategory.defaultColumns = 'name';
ContentCategory.register();
