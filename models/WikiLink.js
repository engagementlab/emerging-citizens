/**
 * Emerging Citizens
 * 
 * WikiLink Model
 * @module WikiLink
 * @class WikiLink
 * @author Johnny Richardson
 * 
 * For field docs: http://keystonejs.com/docs/database/
 *
 * ==========
 */
var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * WikiLink Model
 * ==========
 */

var WikiLink = new keystone.List('WikiLink', {
    nocreate: false, 
    track: true,
    autokey: { path: 'key', from: 'articleName', unique: true },
    map: { name: 'articleName' }
});

WikiLink.add({
    articleName: { type: String, label: 'Destination Article Name', initial:true, required:true},
    articleImage: { type: Types.CloudinaryImage, label: "Destination Article Image", note: "Images should be in square format to display properly"},
    articleDescription: { type: Types.Markdown, label: 'Destination Article Description', initial:true, required:true},
	category: {
        type: Types.Relationship,
        ref: 'WikiTopic',
        label: 'Topic', 
        many: true
    }
});

WikiLink.schema.statics.removeResourceRef = function(resourceId, callback) {

    WikiLink.model.update({
            $or: [{
                'category': resourceId
            }]
        },

        {
            $pull: {
                'category': resourceId
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

/**
 * Registration
 */

WikiLink.defaultColumns = 'name, category';
WikiLink.register();
