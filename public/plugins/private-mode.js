'use strict';
/**
 * Emerging Citizens
 * Developed by Engagement Lab, 2016
 * ==============
 * 
 * Detect private browsing mode (Private/Incognito) -- based on https://gist.github.com/cou929/7973956.
 * ==========
 */

function retry(isDone, next) {
    var current_trial = 0, max_retry = 50, interval = 10, is_timeout = false;
    var id = window.setInterval(
        function() {
            if (isDone()) {
                window.clearInterval(id);
                next(is_timeout);
            }
            if (current_trial++ > max_retry) {
                window.clearInterval(id);
                is_timeout = true;
                next(is_timeout);
            }
        },
        10
    );
}

function isIE10OrLater(user_agent) {

    var ua = user_agent.toLowerCase();
    if (ua.indexOf('msie') === 0 && ua.indexOf('trident') === 0) {
        return false;
    }
    var match = /(?:msie|rv:)\s?([\d\.]+)/.exec(ua);
    var edge = /edge/.exec(ua); 
    
    if(edge && edge[0] == 'edge')
        return true;
    
    if (match && parseInt(match[1], 10) >= 10)
        return true;

    return false;

}

function detectPrivateMode(callback) {
    var isPrivate;

    if (window.webkitRequestFileSystem) {
        window.webkitRequestFileSystem(
            window.TEMPORARY, 1,
            function() {
                isPrivate = false;
            },
            function(e) {
                console.log(e);
                isPrivate = true;
            }
        ); 
    } else if (window.indexedDB && /Firefox/.test(window.navigator.userAgent)) {
        var db;
        try {
            db = window.indexedDB.open('test');
        } catch(e) {
            isPrivate = true;
        }

        if (typeof isPrivate === 'undefined') {
            retry(
                function isDone() {
                    return db.readyState === 'done' ? true : false;
                },
                function next(is_timeout) {
                    if (!is_timeout) {
                        isPrivate = db.result ? false : true;
                    }
                }
            );
        }
    } else if (isIE10OrLater(window.navigator.userAgent)) {
        isPrivate = false;
        try {
            if (!window.indexedDB) {
                isPrivate = true;
            }                 
        } catch (e) {
            isPrivate = true;
        }
    } else if (window.localStorage && /Safari/.test(window.navigator.userAgent)) {
        try {
            window.localStorage.setItem('test', 1);
        } catch(e) {
            isPrivate = true;
        }

        if (typeof isPrivate === 'undefined') {
            isPrivate = false;
            window.localStorage.removeItem('test');
        }
    }

    retry(
        function isDone() {
            return typeof isPrivate !== 'undefined' ? true : false;
        },
        function next(is_timeout) {
            callback(isPrivate);
        }
    );
}