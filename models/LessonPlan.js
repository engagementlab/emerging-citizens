/**
 * Emerging Citizens
 * 
 * LessonPlan Model
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
 * LessonPlan Model
 * ==========
 */

var LessonPlan = new keystone.List('LessonPlan', {
    
    label: 'Lesson Plans',
    singular: 'Lesson Plan',
    nodelete: false, 
    nocreate: false

});

LessonPlan.add({
    
    name: { type: String, default: 'Lesson Plan', required:true, initial: true },
    text: { type: Types.Markdown, label: 'Text', required: true, initial: true }, 
    contentCategories: { type: Types.Relationship, label: "Content Categories", ref: 'ContentCategory', many: true },
  }, 
    "Game", {
            "HTYI": {type: Types.Boolean},
            "WikiGeeks": {type: Types.Boolean},
            "WWDMM": {type: Types.Boolean}
          }

);

/**
 * Registration
 */
 LessonPlan.defaultColumns = 'name';
 LessonPlan.register();
