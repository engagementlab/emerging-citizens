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

  topicName: { type: String, required: true, initial: true, label: "Category Name" }, 
  game: { type: Types.Select, label: "Which game(s) is this content for?", options: "WikiGeeks, HTYI", many: true}, 
  topicDescription: { type: Types.Markdown, label: "Description for Wiki Geeks topics.", dependsOn: {game: "WikiGeeks"}}, 
  topicImage: { type: Types.CloudinaryImage, label: "Topic Image", dependsOn: {game: "WikiGeeks"}}

});

/**
 * Registration
 */

ContentCategory.defaultColumns = 'topicName, game';
ContentCategory.register();
