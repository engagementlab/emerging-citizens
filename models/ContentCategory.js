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

  name: { type: String, required: true, initial: true, label: "Category Name" }, 
  game: { type: Types.Select, required: true, initial: true, label: "Which game(s) is this content for?", options: "WikiGeeks, HTYI", many: true} 

});

/**
 * Registration
 */

ContentCategory.defaultColumns = 'name';
ContentCategory.register();
