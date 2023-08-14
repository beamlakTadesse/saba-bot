/** @format */

const { Markup } = require("telegraf");
const BaseScene = require("telegraf/scenes/base");

// Scene for selecting user role
const sexScene = new BaseScene("sex");

sexScene.enter((ctx) => {
  ctx.reply("Please enter your Sex", {
    reply_markup: Markup.keyboard([["Female", "Male"]])
      .resize()
      .oneTime(),
  });
});

sexScene.hears(/^(female|male)$/i, async (ctx) => {
  const sex = ctx.match[1].toLowerCase();
  ctx.session.sex = sex;

  // Leave the roleScene
  return await ctx.scene.enter("getEducationLevel");
});

module.exports = sexScene;
