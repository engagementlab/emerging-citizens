'use strict';
/**
 * Emerging Citizens
 * Developed by Engagement Lab, 2016
 * ==============
 * 
 * Script for GROUP'S WWDMM socket events. Loaded to group screen upon load of monitor view.
 * ==========
 */

var resultsAnimSlider;
var gameEvents = function(eventId, eventData) {

  /*
    Catch socket events
  */
  switch (eventId) {

    case 'meme:topic':

      $('#gameContent').html(eventData);

      break;

  }

};