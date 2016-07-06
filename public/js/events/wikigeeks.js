'use strict';
/**
 * Emerging Citizens
 * Developed by Engagement Lab, 2016
 * ==============
 * 
 * Script for PLAYERS' WikiGeeks socket events. Loaded to client upon successful login.
 * ==========
 */
var playerWasReconnected = false;

var gameEvents = function(eventId, eventData) {

    const API_URL = 'https://en.wikipedia.org/w/api.php?callback=?';
    var workspace;

    /* 
      Client methods for game
    */
    var removeDom = function (selector) {
      
      $(workspace).find(selector).remove();
    
    };

    var retrieveArticle = function(articleTitle) {

      var retrievalUrl = API_URL + '&action=parse&format=json&redirects&page=' + articleTitle;

      // Tell server about this article being chosen by player
      socket.emit('article:select', emitData(articleTitle));

      // Get article content
      $.getJSON(
          retrievalUrl,
          function(articleData) {
           
            displayWikiContent(articleData);

            $('#topic-submission').fadeOut(function() {
              $('#wiki-article').fadeIn();
            });

        });

    }

    var displayWikiContent = function(articleData) {

      let articleMarkup = articleData.parse.text['*'];
      workspace = $('#wiki-workspace');

      // Inject article html into temp workspace
      $(workspace).html(articleMarkup);
      
      // Clean the workspace of any wiki elements we don't want
      removeDom('table.infobox');
      removeDom('div#toc')
      removeDom('div.thumb');
      removeDom('span.mw-editsection');
      removeDom('sup');
      removeDom('table');
      removeDom('.wikitable');

      // Remove all content below 'See also'
      $('span#See_also').parent().nextAll().remove();
      $('span#See_also').parent().remove();

      // Show article
      $('#wiki-content')
      .html($(workspace).clone().html())

      // Get all links in article
      .find('a')
      .click(function(e){
          
          e.preventDefault();
          
          // Get link's event data (article title) and search for it
          var articleTitle = $(e.currentTarget).data().title;
          retrieveArticle(articleTitle);

      })
      // Go through each link
      .each(function(index, link) {
        
        // Set the data object for this link with the article it would be linking to
        $(link).data({
            title: $(link).attr('href').replace('/wiki/','')
        });
      
      });

      // Clear the temp workspace
      $(workspace).empty();

    };

    /*
      Catch socket events
    */
    switch (eventId) {

        case 'game:start':

            if(location.href.indexOf('debug') !== -1) {

              // Get a random article while debugging, for tickles!
              $.getJSON(
                API_URL + '&action=query&format=json&list=random&rnnamespace=0&rnfilterredir=nonredirects&rnlimit=1',
                
                function(randomData) {
                 
                  $('#article_input').val(randomData.query.random[0].title);

              });

            }

            // Form click to search for first article
            $('#btn_search').click(function(evt) {

              retrieveArticle($('#article_input').val());

            });
            
            break;
    
         // An article was found
        case 'article:found':

            let startingUrl = API_URL + '&pageid=' + eventData.articleId;

	          $('#gameContent').html(eventData.html);

            $.getJSON(
                startingUrl,
                function(articleData) {
                 
                  displayWikiContent(articleData);

              });

            break;

        case 'article:target':

          console.log('done', eventData)

          break;

        case 'topic:info':
        
            $('section#article').show();

            break;

    }

};
