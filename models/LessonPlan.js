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
    autokey: { path: 'plan_key', from: 'name', unique: true },
    nodelete: false, 
    nocreate: false

});

LessonPlan.add({
    
    name: { type: String, default: 'Lesson Plan', required:true, initial: true },
    text: { type: Types.Markdown, label: 'Byline', required: true, initial: true }, 
    learningObj: { type: Types.Markdown, label: 'Learning Objectives' }, 
    getStarted: { type: Types.Markdown, label: "How To Get Started"},
    category: { type: Types.Relationship, label: "Content Categories", ref: 'ContentCategory' },
    relatedGame: { type: Types.Relationship, label: "Associated Game(s)", ref: 'GameConfig' }, 
    eta: { type: String, label: "Estimated Time To Play" },
    enabled: { type: Types.Boolean, label: "Enabled?"}
});

// LessonPlan.schema.pre('save', function(next) {

// 		this.keyName = this.name.replace(/' '/g,'-');

// 		console.log (this.keyName, "keyname");
    

//     next();

// });

/**
 * Registration
 */
 LessonPlan.defaultColumns = 'name';
 LessonPlan.register();
