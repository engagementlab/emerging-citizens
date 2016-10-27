var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Person Model
 * ==========
 */

var Person = new keystone.List('Person', {
		label: 'People',
		singular: 'Person',
    track: true,
    candelete: true, 
    cancreate: true
});

Person.add({
	name: { type: Types.Name, required: true, index: true },
	email: { type: Types.Email, label: "Email Address"},
	text: { type: Types.Markdown, label: "Blurb"}, 
	image: { type: Types.CloudinaryImage, label: 'Image', note: 'Must be in square format. Will display as 192px by 192px.' },
	type: { type: Types.Select, label: "Person Category", options: "teacher, partner", initial: true, required: true}, 
	enabled: { type: Types.Boolean, label: "Enabled?"}


});


/**
 * Registration
 */

Person.defaultColumns = 'name, type';
Person.register();
