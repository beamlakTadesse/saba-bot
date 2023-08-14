/** @format */

const { Markup } = require("telegraf");
const BaseScene = require("telegraf/scenes/base");

// Scene for collecting user's age
const getAgeScene = new BaseScene("getAge");

getAgeScene.enter((ctx) => {
  ctx.reply("Please enter your age:");
});

getAgeScene.on("text", async (ctx) => {
  const age = parseInt(ctx.message.text, 10);

  // Validate the age
  if (isNaN(age) || age <= 0 || age >= 150) {
    ctx.reply("Please enter a valid age.");
    return;
  }

  // Save the age in the session
  ctx.session.age = age;

  // move to getLanguageScene
  await ctx.scene.enter("getLanguage");

  // Add any additional logic or transition to another scene if needed
});

module.exports = getAgeScene;
