/** @format */

const { Markup } = require("telegraf");
const BaseScene = require("telegraf/scenes/base");

// Scene for collecting user's preferred language
const getLanguageScene = new BaseScene("getLanguage");

getLanguageScene.enter((ctx) => {
  ctx.session.lastScene = ctx.scene.current ? ctx.scene.current.id : null;
  

  ctx.reply("-", {
    reply_markup: Markup.keyboard([["English", "Amharic","Afaan Oromo","Tigrgna"]])
      .resize()
      .oneTime(),
  });
});

getLanguageScene.hears(/^(english|amharic|afaan oromo|tigrgna)$/i, async (ctx) => {
  const language = ctx.match[1].toLowerCase();
  if(language=="english"){
    ctx.i18n.locale('en');
  }
  else if(language=="amharic"){
    ctx.i18n.locale('am');
  }else if(language=="afaan oromo"){
    ctx.i18n.locale('or');
  }
  else if(language=="tigrgna"){
    ctx.i18n.locale('tr');
  }else{
    ctx.i18n.locale('en');
  }
  // Save the language in the session
  ctx.session.language = language;
  // move to getEducationLevelScene
  await ctx.scene.enter("role");
});
getLanguageScene.hears("/start", async (ctx) => {
  await ctx.scene.leave("role");
});
module.exports = getLanguageScene;
