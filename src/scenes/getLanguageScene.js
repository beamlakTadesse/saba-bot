/** @format */

const { Markup } = require("telegraf");
const BaseScene = require("telegraf/scenes/base");

// Scene for collecting user's preferred language
const getLanguageScene = new BaseScene("getLanguage");

getLanguageScene.enter((ctx) => {
  ctx.reply("Please select your preferred language:", {
    reply_markup: Markup.keyboard([["English", "Amharic"]])
      .resize()
      .oneTime(),
  });
});

getLanguageScene.hears(/^(english|amharic)$/i, async (ctx) => {
  const language = ctx.match[1].toLowerCase();

  // Save the language in the session
  ctx.session.language = language;

  // move to getEducationLevelScene
  await ctx.scene.enter("sex");
});

module.exports = getLanguageScene;
