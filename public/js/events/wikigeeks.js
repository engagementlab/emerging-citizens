'use strict';

/**
 * Emerging Citizens
 * Developed by Engagement Lab, 2016
 * ==============
 * 
 * Script for PLAYERS' WikiGeeks socket events. Loaded to client upon successful login.
 * ==========
 */
var playerWasReconnected;
var retrievingData;
var random;

if ($('.article-error').css('display') !== 'none')
    setTimeout($('.article-error').hide(), 5000);

//Add 'wikigeeks' class to body
$('.body').addClass('wikigeeks');

var gameEvents = function(eventId, eventData) {

    const API_URL = 'https://en.wikipedia.org/w/api.php?callback=?';
    var workspace;

    /* 
        Client methods for game
    */
    var removeDom = function(selector) {

        $(workspace).find(selector).remove();

    };

    var retrieveArticle = function(articleTitle, initialSearch, displayNow) {

        if (retrievingData === true)
            return;

        var retrievalUrl = API_URL + '&action=parse&format=json&redirects&page=' + articleTitle;

        sessionStorage.setItem('currentArticle', articleTitle);

        // Tell server about this article being chosen by player
        var str = String(articleTitle);
        var articleChosen = $('.article-name');

        articleChosen.text(articleTitle);

        retrievingData = true;

        // Get article content
        $.getJSON(
            retrievalUrl,
            function(articleData) {

                if(articleData.error) {

                    var msg = "Looks like there's something up with that link/article...<br />Try a different one!";

                    $('.error').html(msg).fadeIn();
                    
                    retrievingData = false;
                    return;                
                }

                if (articleData.parse.redirects.length !== 0)
                    articleTitle = articleData.parse.redirects[0].to;
                
                // if (articleData.error) {
                //     $(articleInput).addClass('invalid');
                //     $('.error').text(articleData.error.info).fadeIn();

                //     return;
                // }
                displayWikiContent(articleData);

                // Tell server about this article being chosen by player, unless overriden
                if (!displayNow)
                    socket.emit('article:select', emitData({
                            title: articleTitle,
                            initial: initialSearch
                        })
                    );

                // Used only for auto-submission
                else if (displayNow) {
                    $('#topic-submission').fadeOut(function() {

                        $('section#submitted').hide();
                        $('#wiki-article').fadeIn();
                        $('section#article').show();

                    });
                }

                if (!random)
                    $('#article .article-name').html(articleTitle);
                else 
                    $('#article .article-name').html('Our random article generator sent you to<br />' + articleTitle);

                retrievingData = false;
                random = false;
            });

    };

    var displayWikiContent = function(articleData) {

        var articleMarkup = articleData.parse.text['*'];
        workspace = $('#wiki-workspace');

        // Inject article html into temp workspace
        $(workspace).html(articleMarkup);

        var articleWidth = $(window).width();

        // Clean the workspace of any wiki elements we don't want
        // if ($('table.infobox')) 
        $('section#article').width(articleWidth);
        $('table').css({
            "max-width": articleWidth,
            "width": "100%",
            "font-size": ".9em",
            "word-break": "break-word"
        });
        $('ul.gallery').css({
            "list-style": "none",
            "padding": "0"
        });
        $('.thumbinner').css({
            "width": "auto",
            "max-width": articleWidth - 50
        });
        $('.thumbinner img').css({
            "width": "auto",
            "max-width": articleWidth - 100
        });
        $('img').css({
            "width": "auto",
            "max-width": articleWidth - 100,
            "margin": "0 auto"
        });
        $('.gallerytext').css("text-align", "center");
        $('table img').css("display", "none");
        $('a.image img').css({
            "margin": "0 auto"
        });
        $('table, table.infobox, .thumbinner').css({
            "margin": "0 auto",
            "float": "none"
        });
        $('table tr, table td, table th').css({
            "background-color": "white",
            "color": "#36d5d9"
        })
        $('table:not(:has(table))').css({
            "margin-top": "5%",
            "margin-bottom": "5%"
        });
        $('table tr:not(:has(tr)), table th:not(:has(th)), table td:not(:has(td))').css({
            "border": "1px solid #36d5d9",
            "padding": "2px"
        });
        $('table.infobox td, .infobox th, .thumbinner').css("padding", "1px");
        $('.nowraplinks, .nowraplinks tr').css('border', '1px solid #36d5d9');
        $('.nowraplinks th').css('padding', '8px');
        $('table.rquote').css("width", "100%");
        $('table.metadata').css("border", "none");
        $('.thumb').css({
            "border": "1px solid",
            'background-color': '#e6e6e6',
            "margin": "2%"
        });
        $('.thumbinner').css('padding', '2%');
        $('div:has(>.wikitable)').css({
            "width": "100%",
            "display": "block"
        });

        removeDom('table.metadata td:has(img)');
        removeDom('.mbox-image');
        removeDom('.tocnumber');
        removeDom('.mw-editsection');
        removeDom('.plainlinks.hlist.navbar.mini');
        removeDom('span.flagicon');
        removeDom('.metadata .image');

        removeDom('div#toc');
        removeDom('.references');

        removeDom('sup');
        
        //Add necessary inline style changes
        $('li').css("text-align", "left");
        $('li.gallerybox').css("width", "100%");
        $('li.gallerybox div:first-child').css("width", "100%");

        // Remove all content below 'See also'
        $('span#See_also').parent().nextAll().remove();
        $('span#See_also').parent().remove();

        // Show article
        $('#wiki-content')
        .html($(workspace).clone().html())
        // Get all links in article
        .find('a')
        .click(function(e) {

            e.preventDefault();

            // Get link's event data (article title) and search for it
            var articleTitle = $(e.currentTarget).data().title;
            retrieveArticle(articleTitle, false);


        })
        // Go through each link
        .each(function(index, link) {

            // Set the data object for this link with the article it would be linking to
            $(link).data({
                title: $(link).attr('href').replace('/wiki/', '')
            });

            if ($(link).hasClass('new')){
                $(link).attr('href', 'javascript:void(0)')
                       .attr("disabled", "disabled");
            }

        });

        window.scrollTo(0, 0);

        // Clear the temp workspace
        $(workspace).empty();

    };


    /*
      Catch socket events -- MAKE SURE ALL EVENT IDS ARE IN global.hbs
      */
    switch (eventId) {

        case 'game:start':

            if (sessionStorage.currentArticle && playerWasReconnected)
                retrieveArticle(sessionStorage.currentArticle, false, true);

            var articleInput = $('#article_input');

            if (location.href.indexOf('debug') !== -1) {

                // Get a random article while debugging, for tickles!
                $.getJSON(
                    API_URL + '&action=query&format=json&list=random&rnnamespace=0&rnfilterredir=nonredirects&rnlimit=1',

                    function(randomData) {

                        articleInput.val(randomData.query.random[0].title);

                    }
                );

            }

            $('button#clear').click(function() {

                articleInput.val('');
                $(this).addClass("hidden");
                $('.submission .form').removeClass("moveUp");

            });

            // Form click to search for first article
            $('#btn_search').click(function(evt) {

                var btn = $(evt.currentTarget);
                
                btn.find('span').fadeOut(150, function() {
                    btn.find('img').fadeIn(150);                    
                });    

                btn.attr('disabled', 'true');

                retrieveArticle(articleInput.val(), true);

            });

            // Enable autocomplete to Wikipedia search API
            articleInput.autocomplete({
                source: function(request, response) {

                    $.ajax({
                        url: "https://en.wikipedia.org/w/api.php",
                        dataType: "jsonp",
                        data: {
                            'action': "opensearch",
                            'format': "json",
                            'search': request.term
                        },
                        success: function(data) {
                            response(data[1]);
                        }
                    });

                },
                select: function(event, ui) {

                    $('button#clear').removeClass("hidden");
                    $('.submission .form').addClass("moveUp");
                    
                }
            });

            // Hide any errors during typing
            articleInput.keypress(function(evt) {
                $(evt.currentTarget).removeClass('invalid');
                $('.error').fadeOut(250);
            });

            break;

        // Player guess the target article for start
        case 'article:tryagain':

            $('.error').text(eventData).fadeIn();

            break;

        // An article submission is valid
        case 'article:valid':

            if(eventData.initial) {

                $('#topic-submission').fadeOut(function() {
                    $('section#submitted').fadeIn();
                    $('#wiki-article').fadeIn();
                });

            }

            break;

        case 'article:random':

            random = true;
            retrieveArticle(eventData, false, true);

            break;

        case 'wiki:results':

            updateGameContent(eventData);

            var timing = 500;
            var timingOffset = 0;
            var firstText = $('#firstArticle');
            var groups = $('.articleGroup');

            $(firstText).css({
                transform: 'scale(1)'
            });

            // Animations for each article path
            $.each(groups, function(index, group) {

                var dots = $(group).find('.articleDot');
                var line = $(group).find('.articleLine');
                var text = $(group).find('.articleText');
                var offset = (timing + timingOffset);

                $(dots[0]).delay(offset).velocity({
                    r: 10
                }, timing, [50, 10]);

                $(line).delay(500 + offset).velocity({
                    y2: 50
                }, timing, [50, 10]);

                $(dots[1]).delay(1000 + offset).velocity({
                    r: 10
                }, timing, [50, 10]);

                setTimeout(function() {

                    $(text).css({
                        transform: 'scale(1)'
                    });

                }, 1500 + offset);

                timingOffset = 5 * timing * index;

                $('#survey-ready').click(function() {
                    $('.results-container').fadeOut();
                    $('.typeform').fadeIn();

                });

            });

            break;

        case 'topic:info':

            $('.timesUp').hide();
            $('input').disabled = false;

            var CheckArticle = function() {
                if ($('section#submitted').css("display") !== "none") {
                    $('section#submitted').hide();
                } else {
                    clearInterval(checkSearching);
                }
            }

            $('#wiki-article').show();
            $('section#article').show();
            $('section#submitted').hide();

            var checkSearching = setInterval( function(){ CheckArticle() }, 1000);

            break;

        case 'player:reconnected':

            playerWasReconnected = true;

            break;

        case 'game:countdown_ending':
        
            if (sessionStorage.currentArticle !== undefined && playerWasReconnected === true) {
                socket.emit('game:start', {
                    gameId: sessionStorage.gameCode
                });
            }

            if ($('#topic-submission').css('display') !== 'none')
                $('.form .error').text(eventData + "If you haven't found a starting article soon, we will choose one for you..");

            break;

        case 'game:countdown_end':

            $('input').disabled = false;

            if ($('#submitted').css('display') === 'none') {
                // Topic was not submitted
                $('input').disabled = true;
                
                $('.timesUp').html("<span>Time is up! Sending you to a random article...</span>");
                $('.timesUp').show();
                $('#topic-submission').hide();
            }
            else if ($('section#submitted').css('display') !== 'none') {
                // Topic was submitted
                $('input').disabled = true;

                $('.timesUp').html("<span>Time is up! Sending you to your starting article...</span>");
                $('.timesUp').show();
                $('section#submitted').hide();
            }
            
            break;

    }

};
