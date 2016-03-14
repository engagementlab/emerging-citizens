/**
 * Emerging Citizens
 * 
 * GameSession Model
 * @module tweet
 * @class tweet
 * @author Johnny Richardson
 * 
 * ==========
 */

/**
 * GameSession Model
 * ==========
 */
"use strict";

// grab the things we need
var mongoose = require('keystone').get('mongoose');
var _ = require('underscore');

// create a schema
var gameSessionSchema = new mongoose.Schema({

  name: { type: String, required: true },
  accessCode: { type: String, required: true },
  timeLimit: { type: Number, required: true },
  playerCap: { type: Number, required: true },
  gameType: { type: String, required: true }

});

/**
 * Registration
 */
var GameSession = mongoose.model('GameSession', gameSessionSchema);
module.exports = GameSession;