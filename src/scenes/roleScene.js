/** @format */

const { Markup } = require("telegraf");
const BaseScene = require("telegraf/scenes/base");

// Scene for selecting user role
const roleScene = new BaseScene("role");

roleScene.enter((ctx) => {
  ctx.reply("Are you a Doctor or a Patient?", {
    reply_markup: Markup.keyboard([["Doctor", "Patient"]])
      .resize()
      .oneTime(),
  });
});

roleScene.hears(/^(doctor|patient)$/i, async (ctx) => {
  const role = ctx.match[1].toLowerCase();
  ctx.session.role = role;
  if (role === "patient") {
    // Transition to the getNameScene
    return ctx.scene.enter("getAge");
  }
  if (role == "doctor") {
    return ctx.scene.enter("doctorName");
  }

  await ctx.reply(`Welcome, ${role}!`);
  // Add Doctor logic here

  // Save user's role in the session

  // Leave the roleScene
  return ctx.scene.leave();
});

module.exports = roleScene;
