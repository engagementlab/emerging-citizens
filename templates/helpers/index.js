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

    return _helpers;


};