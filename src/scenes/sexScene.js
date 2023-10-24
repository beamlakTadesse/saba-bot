/** @format */

const { Markup } = require("telegraf");
const BaseScene = require("telegraf/scenes/base");

// Scene for selecting user role
const sexScene = new BaseScene("sex");

sexScene.enter((ctx) => {

  ctx.reply(ctx.i18n.t('Sex:'), {
    reply_markup: Markup.keyboard([[ctx.i18n.t('Female'), ctx.i18n.t('Male')]])
      .resize()
      .oneTime(),
  });
});

sexScene.hears(/^(.*)$/, async (ctx) => {
  const sex = ctx.match[1].toLowerCase();
  ctx.session.sex = sex;

  // Leave the roleScene
   await ctx.scene.enter("getEducationLevel");
});

module.exports = sexScene;
