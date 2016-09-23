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

		name: { type: String, required: true, default: "Global Game Config" },
		enabled: { type: Boolean, label: "Game Is Running?", note: "Disabling game will show 'coming soon'/signup page." }

	},

	"Hashtag You're It", {

	  playerCapHashtag: { type: Number, label: "Player Cap", required: true, initial: true },
	  timeLimitHashtag: { type: Number, label: "Time Limit", required: true, initial: true },
		roundNumberHashtag: { type: Number, label: "Number of Rounds", required: true, initial: true },
		voteScoreGuess: { type: Number, label: "Score per Vote for guess", required: true, initial: true },
		voteScoreReal: { type: Number, label: "Score per Vote for real", required: true, initial: true }, 
		surveyHashtag: { type: Boolean, label: "Typeform Survey At End?", note: "Survey only appears if typeform is enabled." }, 
		surveyUrlHashtag: { type: String, label: "Typeform Survey URL Link", dependsOn: {surveyHashtag: true}}

	}, 
	"Wiki Geeks", {

	  playerCapWiki: { type: Number, label: "Player Cap", required: true, initial: true },
	  articleCooldownWiki: { type: Number, label: "Article Reveal Cooldown", required: true, initial: true },
	  
	  timeLimitWiki: { type: Number, label: "Time Limit", required: true, initial: true },
		roundNumberWiki: { type: Number, label: "Number of Rounds", required: true, initial: true },

		scoreTargetReachedWiki: { type: Number, label: "Target Reached Bonus", required: true, initial: true },
		scorePlacementWiki: { type: Number, label: "Base score - Rank placement", required: true, initial: true },
		scoreUnderClicksWiki: { type: Number, label: "Under Clicks Bonus", required: true, initial: true }, 
		surveyWiki: { type: Boolean, label: "Typeform Survey At End?", note: "Survey only appears if typeform is enabled." }, 
		surveyUrlWiki: { type: String, label: "Typeform Survey URL Link", dependsOn: {surveyWiki: true}}

	}, 
	"Wait Wait Don't Meme Me", {

	  timeLimitMeme: { type: Number, label: "Time Limit", required: true, initial: true },
	  scoreVoteMeme: { type: Number, label: "Vote Score", required: true, initial: true }, 
		roundNumberMeme: { type: Number, label: "Number of Rounds", required: true, initial: true },
		surveyMeme: { type: Boolean, label: "Typeform Survey At End?", note: "Survey only appears if typeform is enabled." }, 
		surveyUrlMeme: { type: String, label: "Typeform Survey URL Link", dependsOn: {surveyMeme: true}}

	}

);

/**
 * Registration
 */

GameConfig.defaultColumns = 'name';
GameConfig.register();
