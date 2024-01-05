/** @format */

const { Markup } = require("telegraf");
const BaseScene = require("telegraf/scenes/base");

// Scene for selecting user role
const sexScene = new BaseScene("sex");
const setLan=(ctx)=>{
  const language = ctx.session.language;

  if (language == "english") {
    ctx.i18n.locale("en");
  } else if (language == "amharic") {
    ctx.i18n.locale("am");
  } else if (language == "afaan oromo") {
    ctx.i18n.locale("or");
  } else if (language == "tigrgna") {
    ctx.i18n.locale("tr");
  } else {
    ctx.i18n.locale("en");
  }
}
sexScene.enter((ctx) => {
  ctx.session.lastScene = ctx.scene.current ? ctx.scene.current.id : null;

  setLan(ctx)
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
sexScene.hears("/start", async (ctx) => {
  await ctx.scene.leave("role");
});
module.exports = sexScene;
