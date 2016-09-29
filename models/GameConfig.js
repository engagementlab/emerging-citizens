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
    candelete: true, 
    cancreate: true, 
    map: { name: 'gameType' }
});

GameConfig.add({

		name: { type: String, hidden: true, default: "Game Config" },
		gameType: { type: Types.Select, lable: "Which game are you configuring?", options: "htyi, wikigeeks, wwdmm", initial: true, required: true},
		enabled: { type: Boolean, label: "Game Is Running?", note: "Disabling game will show 'coming soon'/signup page." }, 
		playerCap: { type: Number, label: "Player Cap", required: true, initial: true },
	  timeLimit: { type: Number, label: "Time Limit", required: true, initial: true },
		roundNumber: { type: Number, label: "Number of Rounds", required: true, initial: true },

		voteScoreGuess: { type: Number, label: "Score per Vote for guess", dependsOn: {gameType: "htyi"}},
		voteScoreReal: { type: Number, label: "Score per Vote for real", dependsOn: {gameType: "htyi"}}, 

		scoreTargetReached: { type: Number, label: "Target Reached Bonus", dependsOn: {gameType: "wikigeeks"}},
		scorePlacement: { type: Number, label: "Base score - Rank placement", dependsOn: {gameType: "wikigeeks"}},
		scoreUnderClicks: { type: Number, label: "Under Clicks Bonus", dependsOn: {gameType: "wikigeeks"}}, 
		articleCooldown: { type: Number, label: "Article Reveal Cooldown", dependsOn: {gameType: "wikigeeks"}},

		scoreVote: { type: Number, label: "Vote Score", dependsOn: {gameType: "wwdmm"}},

		survey: { type: Boolean, label: "Typeform Survey At End?", note: "Survey only appears if typeform is enabled." }, 
		surveyUrl: { type: String, label: "Typeform Survey URL Link", dependsOn: {survey: true}}, 

		lessonGuide: { type: Types.Markdown, label: "Lesson Guide for this game" }

});

GameConfig.relationship({ ref: 'CategoryContent', path: 'game' })
.relationship({ ref: 'LessonPlan', path: 'game' });

/**
 * Registration
 */

GameConfig.defaultColumns = 'gameType';
GameConfig.register();
