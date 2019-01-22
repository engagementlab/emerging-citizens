/**
 * Emerging Citizens
 * 
 * MemeTopic Model
 * @module MemeTopic
 * @class MemeTopic
 * @author Johnny Richardson
 * 
 * For field docs: http://keystonejs.com/docs/database/
 *
 * ==========
 */
var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * MemeTopic Model
 * ==========
 */

var MemeTopic = new keystone.List('MemeTopic', {
    track: true,
    autokey: { path: 'key', from: 'topicName', unique: true },
    map: { name: 'topicName' }
});

MemeTopic.add({
    
    topicName: { type: String, label: 'Topic Name', initial:true, required:true},
    topicDescriptors: { type: Types.TextArray, label: 'Descriptors' },
    topicImage: { type: Types.CloudinaryImage, label: 'Topic Image', folder: 'emerging-citizens/wwdmm/topic-images', autoCleanup: true, note: "Images should be in square format to display properly" },
    memeImages: { type: Types.CloudinaryImages, label: 'Meme Images', folder: 'emerging-citizens/wwdmm/meme-images', autoCleanup: true, note: "Images should be in square format to display properly" },
    category: {
        type: Types.Relationship,
        ref: 'ContentCategory',
        label: 'Category',
        // filters: { game: "WWDMM"},
        required: true,
        initial: true,
        many: true
    }

});

/**
 * Registration
 */

MemeTopic.defaultColumns = 'topicName, category';
MemeTopic.register();
