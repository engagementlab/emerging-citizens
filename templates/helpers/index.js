'use strict';

var cloudinary = require('cloudinary');
var pluralize = require('pluralize');
var randomNum = require('random-number');

// Declare Constants
var CLOUDINARY_HOST = 'http://res.cloudinary.com';

module.exports = function() {

    var _helpers = {};

    /**
     * Emerging Citizens HBS Helpers
     * ===================
     */

     // standard hbs equality check, pass in two values from template
    // {{#ifeq keyToCheck data.myKey}} [requires an else blockin template regardless]
    _helpers.ifeq = function(a, b, options) {
        if (a == b) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    };

    // standard hbs negative equality check, pass in two values from template
    // {{#ifnoteq keyToCheck data.myKey}} [requires an else blockin template regardless]
    _helpers.ifnoteq = function(a, b, options) {
        if (a != b) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    };

    
    // ### Date Helper
    // A port of the Ghost Date formatter similar to the keystonejs - jade interface
    //
    //
    // *Usage example:*
    // `{{date format='MM YYYY}}`
    // `{{date publishedDate format='MM YYYY'`
    //
    // Returns a string formatted date
    // By default if no date passed into helper than then a current-timestamp is used
    //
    // Options is the formatting and context check this.publishedDate
    // If it exists then it is formated, otherwise current timestamp returned

    _helpers.date = function(context, options) {
        if (!options && context.hasOwnProperty('hash')) {
            options = context;
            context = undefined;

            if (this.publishedDate) {
                context = this.publishedDate;
            }
        }

        // ensure that context is undefined, not null, as that can cause errors
        context = context === null ? undefined : context;

        var f = options.hash.format || 'MMM Do, YYYY',
            timeago = options.hash.timeago,
            date;

        // if context is undefined and given to moment then current timestamp is given
        // nice if you just want the current year to define in a tmpl
        if (timeago) {
            date = moment(context).fromNow();
        } else {
            date = moment(context).format(f);
        }
        return date;
    };

    // ### CloudinaryUrl Helper
    // Direct support of the cloudinary.url method from Handlebars (see
    // cloudinary package documentation for more details).
    //
    // *Usage examples:*
    // `{{{cloudinaryUrl image width=640 height=480 crop='fill' gravity='north'}}}`
    // `{{#each images}} {{cloudinaryUrl width=640 height=480}} {{/each}}`
    //
    // Returns an src-string for a cloudinary image
    _helpers.cloudinaryUrl = function(context, options) {

        // if we dont pass in a context and just kwargs
        // then `this` refers to our default scope block and kwargs
        // are stored in context.hash
        if (!options && context.hasOwnProperty('hash')) {
            // strategy is to place context kwargs into options
            options = context;
            // bind our default inherited scope into context
            context = this;
        }

        // safe guard to ensure context is never null
        context = context === null ? undefined : context;

        // Enable WebP image format where available
        if(options.hash['format'] !== 'svg')
            options.hash['fetch_format'] = 'auto';

        if(context.public_id) {
            var imageName = context.public_id.concat('.', context.format);
            return cloudinary.url(imageName, options.hash).replace('http', 'https');
        } else if(typeof(context) === 'string') {
            return cloudinary.image(context, options.hash).replace('http', 'https');
        }
    };

    _helpers.cloudinaryImg = function(context, options) {
        return _helpers.cloudinaryUrl(context, options);
    }

    // ### CDN Asset Helper
    // Retrieve latest url of a CDN asset
    //
    // *Usage examples:*
    // `{{{cdnAsset product='my-site=module' type='js'}}}`
    //
    // Returns CDN asset url (w/ random version # to flush cache if missing path)
    _helpers.cdnAsset = function(context, options) {

        if (!options && context.hasOwnProperty('hash')) {
            // place context kwargs into options
            options = context;
            
            // bind our default inherited scope into context
            context = this;
        }
        
        if (options) {

            var env = options.hash.env;

            // Fallback to prod file
            if(!env)
                env = 'production';

            var publicId;
            var url;
            var type = options.hash.fetch ? options.hash.fetch : 'raw';

            // Get file URL either by entire path, or just by product and environment
            if(options.hash.path) {
                publicId = [options.hash.product, '/', options.hash.path, '.', options.hash.type].join('');
                
                url = cloudinary.url(publicId, { resource_type: type, secure: true });
            }
            else {
                publicId = [options.hash.product, '/', env, '.', options.hash.type].join('');

                // Randomize file version to force flush of cache
                var random = randomNum({integer: true, min: 1000, max: 100000000});
                
                url = cloudinary.url(publicId, { resource_type: type, secure: true })
                          .replace('v1', 'v'+random);
            }
            
            return url;

        }
        
    };


    //  ### less than checker
    _helpers.iflt = function(a, b, options) {

        if (a < b) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }

    };

    // run a function
    _helpers.runFunction = function(funcName) {

        eval(funcName);

        return null;

    };

    // assign color class based on index for HTYI color cascade
    _helpers.htyiColor = function(index) {

        // Only 7 colors total
        var color_cap = 7;

        return "color-" + index;

    };

    // assign color class based on index for Wikigeeks color cascade
    _helpers.wikiColor = function(index) {

        let colorIndex = index % 5;

        return "color-" + colorIndex;

    };

    //  ### int addition helper
    // Used for increasing int by amount
    //
    //  @amt: Amount to offset
    //
    //  *Usage example:*
    //  `{{sum @index 3}}

    _helpers.sum = function(ind, amt) {
 
        return parseInt(ind) + amt;

    };

    //  ### int multiplier helper
    // Used for multiplying int by factor
    //
    //  @factor: Factor to multiply by
    //
    //  *Usage example:*
    //  `{{multiply 3 @index}}

    _helpers.multiply = function(ind, factor) {
 
        return parseInt(ind) * parseInt(factor);

    };

    // TODO: Keep?
    _helpers.math = function(lvalue, operator, rvalue, options) {
        lvalue = parseFloat(lvalue);
        rvalue = parseFloat(rvalue);
            
        return {
            "+": lvalue + rvalue,
            "-": lvalue - rvalue,
            "*": lvalue * rvalue,
            "/": lvalue / rvalue,
            "%": lvalue % rvalue
        }[operator];
    };
    
    // Replace '[blank]' in tweet text with a large space represented by entity
    _helpers.tweetFormat = function(tweetStr) {
        return tweetStr.replace('[blank]', '&#95;&#95;&#95;&#95;&#95;&#95;&#95;&#95;&#95;&#95;&#95;&#95;&#95;&#95')
    };

    // Remove <p> tag from html string
    _helpers.removePara = function (str) {

        if(!str)
            return '';

        str = str.replace (/<p>/g, '').replace (/<\/p>/g, '');
        return str;

    };

    // Get time in minutes for provided seconds
    _helpers.getMinutes = function (strSeconds) {

        var intSeconds = parseInt(strSeconds);
        console.log(intSeconds);
        var secondsRemainder = (intSeconds % 60);
        console.log(secondsRemainder);
        var displaySeconds = (secondsRemainder < 10) ? ("0" + secondsRemainder) : secondsRemainder;  

        return Math.round(intSeconds / 60) + ':' + displaySeconds; 

    };

    //  ### WikiGeeks result position helper
    // Used for placing path SVG elements for wikigeeks result screen (top players)
    //
    //  @index: article index
    //  @xAxis: position on x axis? 
    //  @dest: is destination point?
    //
    //  *Usage example:*
    //  {{wikiResultPosition @index true false false}}
    _helpers.wikiResultPosition = function(index, xAxis, dest) {

        let baseXVal = 220;

        // y position
        if(!xAxis) {

            if(dest) {

                if(index >= 19) return 380;
                else if(index >= 14) return 290;
                else if(index >= 9) return 200;
                else if(index >= 4) return 110;
                else return 10;

            }
            else {

                if(index === 4) {
                    return 10
                }
                else if(index > 19) return 380;
                else if(index > 14) return 290;
                else if(index >= 10) return 200;
                else if(index > 4) return 110;
                else return 10;
            
            }

        }
        // x position
        else {

            var secondRow = (index > 4 && index < 9),
                fourthRow = (index > 13 && index < 18);
            
            var evenRow = secondRow || fourthRow;

            // Reverse position for even-num rows
            if(evenRow) {

                let offset = index - (secondRow ? 5 : 14); // 5
                let offsetXVal = (baseXVal * 4); // 880
                let xPos = (offsetXVal - (baseXVal * offset)); // 880 - 1100

                if(dest)
                    xPos = (offsetXVal - (baseXVal * offset) - baseXVal);

                return xPos;

            }

            else {

                // TODO: this code is awful. re-think someday.
                let offset = index;
                if(index >= 9)
                    offset -= 9;

                let xPos = (baseXVal * offset);
                
                if(dest && index !== 4)
                    xPos += baseXVal;

                if(dest && index === 9)
                    xPos -= baseXVal;

                return xPos;
            
            }

        }
    }

    _helpers.ordinalPosition = function(index) {
        
        var affixes = ["th","st","nd","rd"],
        remainder = (index+1) % 100;

       return (index+1) + (affixes[(remainder - 20) % 10] || affixes[remainder] || affixes[0]);
    
    }

    _helpers.ellipsis = function (limit, currentText) {
            if (currentText.length > limit)
              return currentText.substr(0, limit) + "...";
          
            else
                return currentText;
    }

    _helpers.upperCase = function(text) {
        if (!text){
            return;
        }
        else {
            text = text.toUpperCase();
            return text;
        }
    }

    //  ### get filetype helper
    // Used to obtain filetype as extension with "-o" CSS affix if available from local MIME type file ref
    //
    //  @file: Local file reference's MIME type
    //
    //  *Usage example:*
    //  `{{fileType file}}

    _helpers.fileType = function(file) {

        var cssTypesApp = {
            'pdf': 'pdf',
            'zip': 'zip',
            'ogg': 'audio',
            'vnd.openxmlformats-officedocument.wordprocessingml.document': 'word',
            'vnd.openxmlformats-officedocument.presentationml.presentation': 'powerpoint',
            'vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'excel'
        };

        var fileType = file.filetype;
        var cssType;

        if (fileType === undefined)
            return 'file';

        if (fileType.indexOf('audio/') !== -1)
            cssType = 'audio';

        else if (fileType.indexOf('video/') !== -1)
            cssType = 'video';

        else if (fileType.indexOf('image/') !== -1)
            cssType = 'image';

        // Find if there is a supported application/ icon
        else {
            var mimeType = file.filetype.replace('application/', '');

            Object.keys(cssTypesApp).forEach(function(t, i) {
                if (t === mimeType) cssType = cssTypesApp[t]
            });
        }

        if (cssType !== undefined)
            return cssType + '-o';
        else
            return 'file';

    }

    //  ### remove whitespace helper
    // Remove all whitespace from string
    //
    //  @str: The string
    //
    //  *Usage example:*
    //  {{trim "Elvis Costello"}}}}

    _helpers.trim = function(str) {

        return str.replace(/ /g, '-').toLowerCase();

    }

    //  ### limit characters helper
    // Limit characters in string to specified length and append ellipses if longer
    //
    //  @str: The string
    //	@length: Desired length of string
    //
    //  *Usage example:*
    //  {{limit "Elvis Costello is an English musician, singer-songwriter and record producer" 20}}}}

    _helpers.limit = function(str, length) {

        if (str.length <= length)
            return str;
        else
            return str.substring(0, length) + "...";

    }

    //  ### generic safe string cleaner
    // Remove all potentially offensive characters from string
    //
    //  @str: The string
    //
    //  *Usage example:*
    //  {{trim "Elvis Costello's mom_is///4very%% nice!!"}}}}

    _helpers.cleanString = function(str) {

        return str.replace(/[\\'\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "");

    }

    //  ### format email as words
    // Replace @ and last dot in email address
    //
    //  @str: The email
    _helpers.emailFormat = function(str) {

        return str.replace('@', ' at ');

    }

    //  ### make first letter uppercase
    _helpers.upperCase = function(str) {

        return str.charAt(0).toUpperCase() + str.slice(1);

    }

    //  ### make string lowercase
    _helpers.lowerCase = function(str) {

        return str.toLowerCase();

    }

    //  ### make string pluralized
    // Run 'pluralize' module on string
    //
    _helpers.pluralize = function(str) {

        return pluralize.plural(str);

    }

    _helpers.trimPluralize = function(str) {
        return _helpers.trim(_helpers.pluralize(str));
    }

    //  ### convert non-https url to https
    // Replace http with https
    //
    //  @str: The url
    _helpers.secureUrl = function(str) {
        
        if(str !== undefined)
            return str.replace('http://', 'https://');
        else
            return str;
    }

    //  ### Remove wrapping <p> from markup html string
    //
    //  @str: The string
    _helpers.removePara = function(str) {
        
        if(str) {
            var re = new RegExp("<\s*p[^>]*>(.*?)<\s*/\s*p>");
            var arr = re.exec(str);

            if(arr)
                return arr[1];
        }
    }
    return _helpers;


};