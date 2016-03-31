/**
 * Emerging Citizens
 * 
 * GameConfig Model
 * @module models
 * @class GameConfig
 * @author Johnny Richardson
 * 
 * For field docs: http://keystonejs.com/docs/database/
 *
 * ==========
 */
var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * GameConfig Model
 * ==========
 */

var GameConfig = new keystone.List('GameConfig', {
		label: 'Games Config',
    track: true,
    candelete: false
});

GameConfig.add({

		name: { type: String, required: true, default: "Global Game Config" }

	},

	"Hashtag You're It", {
	
		roundNumber: { type: Number, label: "Number of Rounds", required: true, initial: true },
		voteScoreGuess: { type: Number, label: "Score per Vote for guess", required: true, initial: true },
		voteScoreReal: { type: Number, label: "Score per Vote for real", required: true, initial: true }

	}

);

/**
 * Registration
 */

GameConfig.defaultColumns = 'name';
GameConfig.register();
