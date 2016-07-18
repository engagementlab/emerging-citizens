'use strict';

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
    //  `{{sum @index 3}}

    _helpers.sum = function(ind, amt) {
 
        return parseInt(ind) + amt;

    };

    //  ### it multiplier helper
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
        var secondsRemainder = (intSeconds % 60);
        var displaySeconds = (secondsRemainder < 10) ? ("0" + secondsRemainder) : secondsRemainder;  

        return Math.round(intSeconds / 60) + ':' + displaySeconds; 

    };

    _helpers.wikiResultPosition = function(index, xAxis, dest) {

        let baseXVal = 220;

        if(!xAxis) {

            if(dest && index === 4) {
                return 180;
            }
            else {
                if(index > 4) return 180;
                else return 10;
            }

        }
        else {

            // Reverse position for odd-num rows
            if(index > 4) {

                let offset = index - 5;
                let offsetXVal = (baseXVal * 4);

                if(dest)
                    return (offsetXVal - (baseXVal * offset) - baseXVal);
                else
                    return (offsetXVal - (baseXVal * offset));

            }

            else {
                
                let pos = (baseXVal * index);
                
                if(dest && index !== 4)
                    pos += baseXVal;

                return pos;
            
            }

        }
    }

    return _helpers;


};