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
var GameConfig = keystone.List('GameConfig');

/**
 * ContentCategory Model
 * ==========
 */

var ContentCategory = new keystone.List('ContentCategory', {
    track: true,
    map: { name: 'topicName' }
});

ContentCategory.add({

  topicName: { type: String, required: true, initial: true, label: "Category Name" } 
  // game: { type: Types.Relationship, label: "Which game(s) is this content for?", ref: 'GameConfig', many: true} 
  // topicDescription: { type: Types.Markdown, label: "Description for Wiki Geeks topics.", dependsOn: {game: "WikiGeeks"}}, 
  // topicImage: { type: Types.CloudinaryImage, label: "Topic Image", dependsOn: {game: "WikiGeeks"}}

});

/**
 * Relationships
 * =============
 */
ContentCategory.relationship({ ref: 'WikiTopic', path: 'category' })
.relationship({ ref: 'LessonPlan', path: 'contentCategories' });


ContentCategory.schema.pre('remove', function(next) {

  // Remove resource from all that referenced it 
	keystone.list('WikiTopic').model.removeResourceRef(this._id, function(err, removedCount) {

		if(err)
			console.error(err);
    
		if(removedCount > 0)
			console.log("Removed " +  removedCount + " references to '"+ this._id + "'");
		
		next();

	});

});
/**
 * Registration
 */

ContentCategory.defaultColumns = 'name, game';
ContentCategory.register();
