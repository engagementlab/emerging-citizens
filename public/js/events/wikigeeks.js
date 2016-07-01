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

		console.log('binding event for ID: ' + eventId)

    switch (eventId) {
    
         // Begin article search
        case 'article:found':

            debugger;

            var articleContent = eventData.html;
            var linksUrl = 'https://en.wikipedia.org/w/api.php?action=parse&format=json&pageid=' + eventData.articleId + '&callback=?';

            $.getJSON(
                linksUrl,
                function(linksData) {
   
                  let articleMarkup = linksData.parse.text['*'];

                  let doc = $(articleMarkup);
									let links = $('a', doc);
  
					        _.each(links, function(link, ind) {

					        	// console.log('index of ' + $(link).text(), articleContent.indexOf($(link).text()))

					        	articleContent = articleContent.replace(
																        		 new RegExp('\\b' + $(link).text() + '\\b', "g"), 
																        		'_______' + $(link).text() + '________');
					        
					        });

				          $('#gameContent').html(articleContent);

            });

            break;

    }

};