/**
 * Emerging Citizens
 * 
 * WhatIs Model
 * @module comingsoon
 * @class comingsoon
 * @author Johnny Richardson
 * 
 * For field docs: http://keystonejs.com/docs/database/
 *
 * ==========
 */
var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * WhatIs Model
 * ==========
 */

var WhatIs = new keystone.List('WhatIs', {
    
    label: 'What Is EC',
    singular: 'What Is EC',
    nodelete: true

});

WhatIs.add({
    
    name: { type: String, default: 'What Is EC Content', hidden: true },
    text: { type: Types.Markdown, label: 'Main Text', required: true, initial: true }
  }, 
  'HTYI', {
		htyi_blurb: { type: Types.Markdown, label: 'HTYI Blurb'}, 
		htyi_image: { type: Types.CloudinaryImage, label: 'How To Play Image'}
  }, 

  'WikiGeeks', {
  	wiki_blurb: { type: Types.Markdown, label: 'Wiki Blurb'}, 
  	wiki_image: { type: Types.CloudinaryImage, label: 'How To Play Image'}
  }, 

  'WWDMM', {
  	wwdmm_blurb: { type: Types.Markdown, label: 'WWDMM Blurb'}, 
  	wwdmm_image: { type: Types.CloudinaryImage, label: 'How To Play Image'}
  }

);

/**
 * Registration
 */
 WhatIs.defaultColumns = 'name';
 WhatIs.register();
