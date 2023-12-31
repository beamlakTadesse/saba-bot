/** @format */

const { Markup } = require("telegraf");
const BaseScene = require("telegraf/scenes/base");

const doctorNameScene = new BaseScene("doctorName");

doctorNameScene.enter((ctx) => {
  ctx.session.lastScene = ctx.scene.current ? ctx.scene.current.id : null;
  ctx.reply("Please enter the doctor's full name:");
});

doctorNameScene.on("text", async (ctx) => {
  const doctorName = ctx.message.text;

  // Save the doctor's name in the session
  ctx.session.doctorName = doctorName;
  ctx.session.doctorId = ctx.from.id;
  // Move to the next scene to collect the phone number
  ctx.scene.enter("doctorPhoneNumber");

});
doctorNameScene.hears("/start", async (ctx) => {
  await ctx.scene.leave("role");
});
module.exports = doctorNameScene;
