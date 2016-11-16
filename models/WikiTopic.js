/**
 * Emerging Citizens
 * 
 * WikiTopic Model
 * @module WikiTopic
 * @class WikiTopic
 * @author Johnny Richardson
 * 
 * For field docs: http://keystonejs.com/docs/database/
 *
 * ==========
 */
var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * WikiTopic Model
 * ==========
 */

var WikiTopic = new keystone.List('WikiTopic', {
    nocreate: false, 
    track: true,
    autokey: { path: 'key', from: 'topicName', unique: true },
    map: { name: 'topicName' }
});

WikiTopic.add({
    topicName: { type: String, label: 'Topic Name', initial:true, required:true},
    topicImage: { type: Types.CloudinaryImage, label: "Topic Image", note: "Images should be in square format to display properly"},
    topicDescription: { type: Types.Markdown, label: 'Topic Description', initial:true, required:true},
	categoryName: {
        type: Types.Relationship,
        ref: 'ContentCategory',
        label: 'Category', 
        many: false,
        note: 'ONE CATEGORY PER TOPIC'
    }
});

/**
 * Relationships
 * =============
 */
WikiTopic.relationship({ ref: 'WikiLink', path: 'category' });

WikiTopic.schema.statics.removeResourceRef = function(resourceId, callback) {

    WikiTopic.model.update({
            $or: [{
                'categoryName': resourceId
            }]
        },

        {
            $pull: {
                'categoryName': resourceId
            }
        },

        {
            multi: true
        },

        function(err, result) {

            callback(err, result);

            if (err)
                console.error(err);
        }
    );

};

WikiTopic.schema.pre('remove', function(next) {

  // Remove resource from all that referenced it 
    keystone.list('WikiLink').model.removeResourceRef(this._id, function(err, removedCount) {

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

WikiTopic.defaultColumns = 'name, categoryName';
WikiTopic.register();
