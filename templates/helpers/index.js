var hbs = require('handlebars');

module.exports = function() {

    var _helpers = {};

    /**
     * Emerging Citizens HBS Helpers
     * ===================
     */


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

    // _helpers.sortBy = function (data, property, reverse) {
    //     var result;
    //     if (reverse){
    //         result = _.reverse (_.sortBy (data, function(index){ return index.property; }));
    //     } else {
    //         result = _.sortBy (data, function(index){ return index.property; });
    //     }
    //     console.log ("Sorting data with helper... " + JSON.stringify(result));
    //     return result;
    // };

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
    //  `{{add @index 3}}

    _helpers.add = function(ind, amt) {

        console.log(ind, amt)
 
        return parseInt(ind) + amt;

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
    
    _helpers.tweetFormat = function(tweetStr) {
        return tweetStr.replace('[blank]', '&#95;&#95;&#95;&#95;&#95;&#95;&#95;&#95;&#95;&#95;&#95;&#95;&#95;&#95')
    };

    _helpers.removePara = function (str) {
        console.log (str);
        str = str.replace (/<p>/g, '').replace (/<\/p>/g, '');
        console.log (str);
        return str;

    };


    return _helpers;


};