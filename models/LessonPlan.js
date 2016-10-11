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
    learningObj: { type: Types.Markdown, label: 'Learning Objectives - Why this category?' }, 
    category: { type: Types.Relationship, label: "Content Categories", ref: 'ContentCategory' },
    relatedGame: { type: Types.Relationship, label: "Associated Game(s)", ref: 'GameConfig' }, 
    eta: { type: String, label: "Estimated Time To Play" },
    enabled: { type: Types.Boolean, label: "Enabled?"}
});

// LessonPlan.schema.pre('save', function(next) {

// 		this.keyName = this.relatedGame;

// 		console.log (this.keyName, "keyname");
    

//     next();

// });

/**
 * Registration
 */
 LessonPlan.defaultColumns = 'name, relatedGame, category, enabled';
 LessonPlan.register();
