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
     map: {
         name: 'gameType'
     }
 });

 GameConfig.add({

         name: {
             type: String,
             hidden: true,
             from: 'game'
         },
         playLink: {
             type: String,
             label: 'URL for players',
             default: "ecplay.org"
         },
         gameType: {
             type: Types.Select,
             lable: "Which game are you configuring?",
             options: "HTYI, WikiGeeks, WWDMM",
             initial: true,
             required: true
         },
         enabled: {
             type: Boolean,
             label: "Game Is Running?",
             note: "Disabling game will show 'coming soon'/signup page."
         },
         playerCap: {
             type: Number,
             label: "Player Cap",
             required: true,
             initial: true
         },
         timeLimit: {
             type: Number,
             label: "Time Limit",
             required: true,
             initial: true
         },
         votingTimeLimit: {
             type: Number,
             label: "Voting Time Limit",
             dependsOn: {
                 gameType: ["HTYI", "WWDMM"]
             }
         },
         roundNumber: {
             type: Number,
             label: "Number of Rounds",
             required: true,
             initial: true
         },

         voteScoreGuess: {
             type: Number,
             label: "Score per Vote for guess",
             dependsOn: {
                 gameType: "HTYI"
             }
         },
         voteScoreReal: {
             type: Number,
             label: "Score per Vote for real",
             dependsOn: {
                 gameType: "HTYI"
             }
         },

         scoreTargetReached: {
             type: Number,
             label: "Target Reached Bonus",
             dependsOn: {
                 gameType: "WikiGeeks"
             }
         },
         scorePlacement: {
             type: Number,
             label: "Base score - Rank placement",
             dependsOn: {
                 gameType: "WikiGeeks"
             }
         },
         scoreUnderClicks: {
             type: Number,
             label: "Under Clicks Bonus",
             dependsOn: {
                 gameType: "WikiGeeks"
             }
         },
         articleCooldown: {
             type: Number,
             label: "Article Reveal Cooldown",
             dependsOn: {
                 gameType: "WikiGeeks"
             }
         },

         scoreVote: {
             type: Number,
             label: "Vote Score",
             dependsOn: {
                 gameType: "WWDMM"
             }
         },

         survey: {
             type: Boolean,
             label: "Typeform Survey At End?",
             note: "Survey only appears if typeform is enabled."
         },
         surveyUrl: {
             type: String,
             label: "Typeform Survey URL Link",
             dependsOn: {
                 survey: true
             }
         }
     },

     'Lesson Guide', {
         gameLogo: {
             type: Types.CloudinaryImage,
             label: 'Game logo',
             note: "Images should be in square format to display properly",
             folder: 'emerging-citizens/images/layout',
             autoCleanup: true
         },
         text: {
             type: Types.Markdown,
             label: 'Byline'
         },
         categoryBlurb: {
             type: Types.Markdown,
             label: 'Instructions for choosing content categories'
         },
         lessonPlanBlurb: {
             type: Types.Markdown,
             label: 'Lesson Plan Blurb'
         },
         lessonGuide: {
             type: Types.Markdown,
             label: "Lesson Guide/Learning Goals for this game"
         },
         what: {
             type: Types.Markdown,
             label: "What is..?"
         },
         why: {
             type: Types.Markdown,
             label: "Why think about..?"
         },
         tips: {
             type: Types.Markdown,
             label: "Tips to keep in mind"
         },
         questions: {
             type: Types.Markdown,
             label: "Key questions to ask"
         },
         howToPlay: {
             type: Types.Markdown,
             label: "How To Play Steps"
         }
     }
 );

 GameConfig.relationship({
     ref: 'LessonPlan',
     path: 'relatedGame'
 });


 GameConfig.schema.pre('save', function(next) {

     this.name = this.name.toUpperCase();

     next();

 });
 /**
  * Registration
  */

 GameConfig.defaultColumns = 'gameType';
 GameConfig.register();