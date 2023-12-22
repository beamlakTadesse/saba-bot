/** @format */

const { Markup } = require("telegraf");
const BaseScene = require("telegraf/scenes/base");

// Scene for selecting user role
const roleScene = new BaseScene("role");
const setLan = (ctx) => {
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
};
roleScene.enter((ctx) => {
  ctx.reply(ctx.i18n.t("intro"));

  ctx.reply(ctx.i18n.t("Are you a Doctor or a Patient?"), {
    reply_markup: Markup.keyboard([
      [ctx.i18n.t("Doctor"), ctx.i18n.t("Patient")],
    ])
      .resize()
      .oneTime(),
  });
});

roleScene.hears(/^(.*)$/, async (ctx) => {
  const role = ctx.match[1];
  setLan(ctx);
  ctx.session.role = role;
  console.log(ctx.i18n.t("Patient"));
  if (role === ctx.i18n.t("Patient")) {
    // Transition to the getNameScene
    return ctx.scene.enter("getAge");
  }
  if (role == ctx.i18n.t("Doctor")) {
    return ctx.scene.enter("doctorName");
  }

  await ctx.reply(`Welcome, ${role}!`);
  // Add Doctor logic here

  // Save user's role in the session

  // Leave the roleScene
  return ctx.scene.leave();
});

module.exports = roleScene;
