/**
 * Emerging Citizens
 * Developed by Engagement Lab, 2016
 * ==============
 * 
 * Script for PLAYERS' WikiGeeks socket events. Loaded to client upon successful login.
 * ==========
 */
var retrievingData;
var random;
var playerSubmitted = false;
var playerFinished = false;
var groupReady = sessionStorage.getItem('groupReady');
var playerWasReconnected = (sessionStorage.getItem('reconnected') === 'true');

if ($('.article-error').css('display') !== 'none') {
    setTimeout(function() {
        $('.article-error').hide()
    }, 5000);
}

//Add 'wikigeeks' class to body
$('.body').addClass('wikigeeks');

var gameEvents = function(eventId, eventData) {

    var API_URL = 'https://en.wikipedia.org/w/api.php?callback=?';
    var workspace;

    /* 
        Client methods for game
    */
    var removeDom = function(selector) {

        $(workspace).find(selector).remove();

    };

    var retrieveError = function(textStatus) {

        var msg = "Looks like there's something up with that link/article...<br />Try a different one!";

        if(textStatus && textStatus === 'timeout')
            msg = "Sorry, finding that article took too long.<br />Please try again!";

        $('.error').html(msg).fadeIn();

        var btn = $('#btn_search');
        
        btn.find('img').fadeOut(150, function() {
            btn.find('span').fadeIn(150);                    
        });    
        btn.removeAttr('disabled');
        
        retrievingData = false;

        loadToggle(false, true);

    };

    var retrieveArticle = function(articleTitle, initialSearch, displayNow) {

        $('.error').fadeOut(400);

        if (retrievingData === true)
            return;

        var retrievalUrl = API_URL + '&action=parse&format=json&redirects&page=' + articleTitle;

        sessionStorage.setItem('currentArticle', articleTitle);

        // Tell server about this article being chosen by player
        var str = String(articleTitle);
        var articleChosen = $('.article-name');

        articleChosen.text(articleTitle.replace(/_/g, ' '));

        retrievingData = true;

        // Get article content
        $.ajax({

                url: retrievalUrl,
                timeout: 10000,
                dataType: 'json',
                success: function(articleData) {

                    if(articleData.error) {
                        retrieveError();
                        return;                
                    }

                    if (articleData.parse.redirects.length !== 0)
                        articleTitle = articleData.parse.redirects[0].to;

                    console.log(articleTitle);

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
                        $('#article .article-name').text(articleTitle.replace(/_/g, ' '));
                    else 
                        $('#article .article-name').html('Our random article generator sent you to<br />' + articleTitle);
                    
                    retrievingData = false;
                    random = false;

                    if (initialSearch === false)
                      $('#article-loading').hide();  
                    else
                        playerSubmitted = true;
                                    
                },
                error: function(jqXHR, textStatus, errorThrown) {

                    retrieveError(textStatus);
                
                }
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
        // $('table tr, table td, table th').css({
        //     "background-color": "white",
        //     "color": "#36d5d9"
        // });
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

        removeDom('.ambox-Refimprove');
        removeDom('.ambox');
        
        removeDom('.thumb');
        
        removeDom('img');
        removeDom('table');
        
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

            loadToggle(true, true);

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
        
        // Scroll to top
        $('html, body').animate({ scrollTop: 0 }, '500', function () {

            // Workaround for iOS
            window.setTimeout(function() {
                window.scrollTo(0, 0);
            }, 0);

        });

        // Clear the temp workspace
        $(workspace).empty();
        
        loadToggle(false, true);

    };

    $('#btn_ok').on('click', function() {
        $('#time-up').fadeOut();
    });

    /*
      Catch socket events -- MAKE SURE ALL EVENT IDS ARE IN global.hbs
    */
    switch (eventId) {

        case 'game:start':

            updateGameContent(eventData, function() {

                if (sessionStorage.currentArticle && playerWasReconnected){
                    console.log("there is a stored article and player was reconnected");
                    if (groupReady){
                        retrieveArticle(sessionStorage.currentArticle, true, false);
                    } else {
                        retrieveArticle(sessionStorage.currentArticle, true, false);
                    }
                    
                }
                
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
                        btn.find('img').fadeIn(150, function() {

                            retrieveArticle(articleInput.val(), true);
                        
                        });                    
                    });    

                    btn.attr('disabled', 'disabled');

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

            });
            

            break;

        // Player guess the target article for start
        case 'article:tryagain':

                $('#loading-modal').hide();
                $('#btn_search img').hide();
                $('#btn_search span').show();
                $('.error').text(eventData).fadeIn();
                $('input').disabled = false;

                $('#btn_search').attr('disabled', false);

                playerSubmitted = false;

                // loadToggle(false);

            break;

        // An article submission is valid
        case 'article:valid':

            if(eventData.initial) {

                $('#topic-submission').fadeOut(function() {
                    $('section#submitted').fadeIn();
                    $('#wiki-article').fadeIn();
                });

                // sessionStorage.setItem('')
                playerSubmitted = true;

            } 
             if (sessionStorage.currentArticle && playerWasReconnected && groupReady)
                retrieveArticle(sessionStorage.currentArticle, true, true);

            

           
            

            break;

        case 'article:random':

            random = true;
            retrieveArticle(eventData, false, true);
            playerSubmitted = false;

            break;

        case 'player:finished':

            playerFinished = true;

            break;

        case 'wiki:results':

            sessionStorage.removeItem('currentArticle');

            updateGameContent(eventData, function() {

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
                        $('#survey-ready').hide();
                        $('#surveyOptions').show();
                    });

                });

            });        

            break;

        case 'topic:info':

            sessionStorage.setItem('groupReady', true);

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

        case 'game:countdown_ending':

            function bounce() {
                $('.form .error').velocity({scale:1.05}, {duration:500, loop: 1, complete: bounce}, 'easeOutElastic', 5);
            }

            if (playerSubmitted === false){
                $('.form .error').html("15 seconds left! <br> If you haven't found a starting article soon, we will choose one for you..");
                bounce();
            }
            
            break;

        case 'game:countdown_end':

            $('input').disabled = false;
            $('.form .error').hide();

            if (eventData === "results" && !playerFinished)
                $('#time-up').fadeIn(function() {
                    TweenLite.fromTo($('#btn_ok'), 1, {scale:0, autoAlpha:0}, {scale:1, autoAlpha:1, ease:Elastic.easeOut});
                });

            if (eventData === "topicCountdown") {

                if (playerSubmitted === false) {
                    // Topic was not submitted
                    $('input').disabled = true;
                    $('#topic-submission').hide();

                    
                    $('.timesUp').html("<span>Time is up! Sending you to a random article...</span>");
                    $('.timesUp').show();
                    
                } else {
                    // Topic was submitted
                    $('input').disabled = true;
                    $('section#submitted').hide();

                    $('.timesUp').html("<span>Time is up! Sending you to your starting article...</span>");
                    $('.timesUp').show();
                    
                }
            }
            
            break;

        // case 'game:countdown':

        //     console.log(eventData.name, "player clock");

        //     if (eventData.name === 'topicCountdown' || eventData.name === 'articleReveal') {
        //         groupReady = false;
        //     } else {
        //         groupReady = true;
        //     }

        //     break;

        case 'game:ended': 

            sessionStorage.removeItem('currentArticle');
            sessionStorage.removeItem('groupReady');

            break;

        case 'game:notfound': 

            sessionStorage.removeItem('currentArticle');
            sessionStorage.removeItem('groupReady');
            
            break;

        case 'game:advance': 

            sessionStorage.setItem('groupReady', false);

            break;
        
        
    }

};
