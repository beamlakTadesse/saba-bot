/** @format */

require("dotenv").config();
const { Telegraf, Markup } = require("telegraf");
const Stage = require("telegraf/stage");
const session = require("telegraf/session");
const i18n = require("telegraf-i18n");
const path = require("path");

// const Redis = require("ioredis");
// const redis = new Redis(process.env.REDIS_HOST, process.env.REDIS_PORT);

const botToken = process.env.TELEGRAM_TOKEN;
const bot = new Telegraf(botToken);

const i18nMiddleware = new i18n({
  useSession: true,
  directory: path.resolve(__dirname, "localization"),
  defaultLanguage: "en", // Default language
});
bot.use(i18nMiddleware.middleware());
// Create a new stage
const stage = new Stage();

// Register session middleware
bot.use(session());

// Register the stage middleware
bot.use(stage.middleware());

// Import scenes
const contactScene = require("./scenes/contactScene");
const roleScene = require("./scenes/roleScene");
const getAgeScene = require("./scenes/getAgeScene");
const getLanguageScene = require("./scenes/getLanguageScene");
const getEducationLevelScene = require("./scenes/getEducationLevelScene");
const doctorNameScene = require("./scenes/doctorNameScene");
const doctorPhoneNumberScene = require("./scenes/doctorPhoneNumberScene");
// const adminHomeScene = require("./scenes/adminHomeScene");
const conversationScene = require("./scenes/conversationScene");
const getQuestionCategoryScene = require("./scenes/getQuestionCategory");
const getQuestionScene = require("./scenes/getQuestion");
const doctorListeningScene = require("./scenes/doctorListining");
const sexScene = require("./scenes/sexScene");
const changeLanguage = require("./scenes/changeLangScene")
// Register scenes in the stage
stage.register(
  contactScene,
  roleScene,
  getAgeScene,
  getLanguageScene,
  getEducationLevelScene,
  doctorNameScene,
  doctorPhoneNumberScene,
  // adminHomeScene,
  conversationScene,
  getQuestionCategoryScene,
  getQuestionScene,
  doctorListeningScene,
  sexScene,
  changeLanguage
);

// Command handler for /start
bot.start(async (ctx) => {
  // Check if the user has already provided contact and role
  await ctx.reply(`🌟 Welcome to Ask Saba bot!\nPlease let me know your language preference so I can make our chat extra delightful for you! 🌐✨`)
const phoneNumber = ctx.session.phoneNumber;
  const role = ctx.session.role;

  // console.log(phoneNumber, role);
  if (phoneNumber && role) {
    await ctx.reply(`Welcome back!`);

    // Add Doctor or Patient logic here
  } else {
    // Start the contact scene to collect user's contact information
    await ctx.scene.enter("getLanguage");
  }
});
// Command handler
// bot.command('lang', (ctx) => {
//    ctx.scene.enter("changeLanguage");
 
// });

bot.catch((err) => {
  console.error("Error:", err);
  // Respond to the user with an error message
});
bot.launch();
