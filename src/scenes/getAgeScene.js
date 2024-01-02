/** @format */

const { Markup } = require("telegraf");
const BaseScene = require("telegraf/scenes/base");

// Scene for collecting user's age
const getAgeScene = new BaseScene("getAge");
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
getAgeScene.enter((ctx) => {

  setLan(ctx) 

  ctx.reply(ctx.i18n.t("Please enter your age:"));
});

getAgeScene.on("text", async (ctx) => {
  if( "/start"===ctx.message.text){
    await ctx.scene.leave("role");
  }
  const age = parseInt(ctx.message.text, 10);
  setLan(ctx) 

  // Validate the age
  if (isNaN(age) || age <= 0 || age >= 150) {
    ctx.reply(ctx.i18n.t("Please enter a valid age."));
    return;
  }

  // Save the age in the session
  ctx.session.age = age;

  // move to getLanguageScene
  await ctx.scene.enter("sex");

  // Add any additional logic or transition to another scene if needed
});

module.exports = getAgeScene;
