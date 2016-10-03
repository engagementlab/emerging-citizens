var register = function(Handlebars) {

    var _helpers = {};

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

        // Enable WebP image format where available
        options.hash['fetch_format'] = 'auto';

        // safe guard to ensure context is never null
        context = context === null ? undefined : context;

        if ((context) && (context.public_id)) {
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

            // Get file URL either by entire path, or just by product and environment
            if(options.hash.path) {
                publicId = [options.hash.product, '/', options.hash.path, '.', options.hash.type].join('');
                url = cloudinary.url(publicId, { resource_type: 'raw', secure: true });
            }
            else {
                publicId = [options.hash.product, '/', env, '.', options.hash.type].join('');

                // Randomize file version to force flush of cache
                var random = randomNum({integer: true, min: 1000, max: 100000000});
                
                url = cloudinary.url(publicId, { resource_type: 'raw', secure: true })
                          .replace('v1', 'v'+random);
            }
            
            return url;

        }
        
    };

    // ### Content Url Helpers
    // KeystoneJS url handling so that the routes are in one place for easier
    // editing.  Should look at Django/Ghost which has an object layer to access
    // the routes by keynames to reduce the maintenance of changing urls

    // Direct url link to a specific post
    _helpers.postUrl = function(postSlug, options) {
        return ('/blog/post/' + postSlug);
    };

    // might be a ghost helper
    // used for pagination urls on blog
    _helpers.pageUrl = function(pageNumber, options) {
        return '/blog?page=' + pageNumber;
    };

    // create the category url for a blog-category page
    _helpers.categoryUrl = function(categorySlug, options) {
        return ('/blog/' + categorySlug);
    };

    // ### Pagination Helpers
    // These are helpers used in rendering a pagination system for content
    // Mostly generalized and with a small adjust to `_helper.pageUrl` could be universal for content types

    /*
     * expecting the data.posts context or an object literal that has `previous` and `next` properties
     * ifBlock helpers in hbs - http://stackoverflow.com/questions/8554517/handlerbars-js-using-an-helper-function-in-a-if-statement
     * */
    _helpers.ifHasPagination = function(postContext, options) {
        // if implementor fails to scope properly or has an empty data set
        // better to display else block than throw an exception for undefined
        if (_.isUndefined(postContext)) {
            return options.inverse(this);
        }
        if (postContext.next || postContext.previous) {
            return options.fn(this);
        }
        return options.inverse(this);
    };

    _helpers.paginationNavigation = function(pages, currentPage, totalPages, options) {
        var html = '';

        // pages should be an array ex.  [1,2,3,4,5,6,7,8,9,10, '....']
        // '...' will be added by keystone if the pages exceed 10
        _.each(pages, function(page, ctr) {
            // create ref to page, so that '...' is displayed as text even though int value is required
            var pageText = page,
                // create boolean flag state if currentPage
                isActivePage = ((page === currentPage) ? true : false),
                // need an active class indicator
                liClass = ((isActivePage) ? ' class="active"' : '');

            // if '...' is sent from keystone then we need to override the url
            if (page === '...') {
                // check position of '...' if 0 then return page 1, otherwise use totalPages
                page = ((ctr) ? totalPages : 1);
            }

            // get the pageUrl using the integer value
            var pageUrl = _helpers.pageUrl(page);
            // wrapup the html
            html += '<li' + liClass + '>' + linkTemplate({
                url: pageUrl,
                text: pageText
            }) + '</li>\n';
        });
        return html;
    };

    // special helper to ensure that we always have a valid page url set even if
    // the link is disabled, will default to page 1
    _helpers.paginationPreviousUrl = function(previousPage, totalPages) {
        if (previousPage === false) {
            previousPage = 1;
        }
        return _helpers.pageUrl(previousPage);
    };

    // special helper to ensure that we always have a valid next page url set
    // even if the link is disabled, will default to totalPages
    _helpers.paginationNextUrl = function(nextPage, totalPages) {
        if (nextPage === false) {
            nextPage = totalPages;
        }
        return _helpers.pageUrl(nextPage);
    };


    //  ### Flash Message Helper
    //  KeystoneJS supports a message interface for information/errors to be passed from server
    //  to the front-end client and rendered in a html-block.  FlashMessage mirrors the Jade Mixin
    //  for creating the message.  But part of the logic is in the default.layout.  Decision was to
    //  surface more of the interface in the client html rather than abstracting behind a helper.
    //
    //  @messages:[]
    //
    //  *Usage example:*
    //  `{{#if messages.warning}}
    //      <div class="alert alert-warning">
    //          {{{flashMessages messages.warning}}}
    //      </div>
    //   {{/if}}`

    _helpers.flashMessages = function(messages) {
        var output = '';
        for (var i = 0; i < messages.length; i++) {

            if (messages[i].title) {
                output += '<h4>' + messages[i].title + '</h4>';
            }

            if (messages[i].detail) {
                output += '<p>' + messages[i].detail + '</p>';
            }

            if (messages[i].list) {
                output += '<ul>';
                for (var ctr = 0; ctr < messages[i].list.length; ctr++) {
                    output += '<li>' + messages[i].list[ctr] + '</li>';
                }
                output += '</ul>';
            }
        }
        return new hbs.SafeString(output);
    };


    //  ### underscoreMethod call + format helper
    //  Calls to the passed in underscore method of the object (Keystone Model)
    //  and returns the result of format() 
    //
    //  @obj: The Keystone Model on which to call the underscore method
    //  @undescoremethod: string - name of underscore method to call
    //
    //  *Usage example:*
    //  `{{underscoreFormat enquiry 'enquiryType'}}

    _helpers.underscoreFormat = function(obj, underscoreMethod) {
        return obj._[underscoreMethod].format();
    }

    //  ### json string format helper
    // Used for debugging purpose of pretty-printing JSON object to template
    //
    //  @obj: The data object to print
    //
    //  *Usage example:*
    //  `{{jsonPrint data}}

    _helpers.jsonPrint = function(obj) {

        return JSON.stringify(obj, null, 2);
    }

    //  ### href link helper
    // Used for creating an href link with a URL
    //
    //  @text: The text of the link
    //  @url: The URL of the link
    //
    //  *Usage example:*
    //  `{{"See more..." story.url}}

    _helpers.link = function(text, url) {

        url = hbs.escapeExpression(url);
        text = hbs.escapeExpression(text);

        return new hbs.SafeString(
            "<a href='" + url + "'>" + text + "</a>"
        );

    }

    // img helper
    // Used for creating an img tag with URL to local image, given a localfile object

    _helpers.img = function(image) {

        if (image.filename == null)
            return hbs.SafeString('');

        path = hbs.escapeExpression(image.path).replace('./public/', '');
        filename = hbs.escapeExpression(image.filename);

        return new hbs.SafeString(
            "<img src='" + path + "/" + filename + "' alt='" + filename + "'>"
        );

    }

    //  ### index offset helper
    // Used for increasing index by one
    //
    //  @ind: The index to use
    //
    //  *Usage example:*
    //  `{{indIndex @index}}

    _helpers.incIndex = function(ind) {

        return parseInt(ind) + 1;

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
    //  @length: Desired length of string
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

    if (Handlebars && typeof Handlebars.registerHelper === "function") {
        // register helpers
        for (var prop in _helpers) {
            Handlebars.registerHelper(prop, _helpers[prop]);
        }
    } else {
        // just return helpers object if we can't register helpers here
        return _helpers;
    }

};

// client
if (typeof window !== "undefined") {
    register(Handlebars);
}
// server
else {
    // module.exports.register = register;
    module.exports = register(null);
}