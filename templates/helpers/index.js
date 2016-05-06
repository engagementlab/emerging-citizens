var _ = require('underscore');
var hbs = require('handlebars');

module.exports = function() {

    var _helpers = {};

    /**
     * Emerging Citizens HBS Helpers
     * ===================
     */

    // run a function
    _helpers.runFunction = function(funcName) {

        eval(funcName);

        return null;

    };

    // assign color class based on index for HTYI color cascade
    _helpers.htyiColor = function(index) {

        // Only 7 colors total
        var color_cap = 7;

        // If above cap, reset
        // if(index % 7 > 0)


        return "color-" + index;

    };

    //  ### int addition helper
    // Used for increasing int by amount
    //
    //  @amt: Amount to offset
    //
    //  *Usage example:*
    //  `{{add @index}}

    _helpers.add = function(ind, amt) {

        console.log(ind, amt)
 
        return parseInt(ind) + amt;

    }

    return _helpers;


};