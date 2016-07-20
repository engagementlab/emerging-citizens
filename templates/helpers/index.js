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
        var secondsRemainder = (intSeconds % 60);
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
    _helpers.wikiResultPosition = function(index, xAxis, dest, dot) {

        let baseXVal = 220;

        // y position
        if(!xAxis) {

            if(dest) {
                if(index >= 9) return 200;
                else if(index >= 4) return 110;
                else return 10;
            }
            else {

                if(index === 4) {
                    return 10
                }
                else if(index >= 10) return 200;
                else if(index > 4) return 110;
                else return 10;
            
            }

        }
        // x position
        else {

            // Reverse position for odd-num rows
            if(index > 4 && index < 9) {

                let offset = index - 5;
                let offsetXVal = (baseXVal * 4);
                let xPos = (offsetXVal - (baseXVal * offset));

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

                if(index >= 10 || (dest && index === 9))
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

    return _helpers;


};