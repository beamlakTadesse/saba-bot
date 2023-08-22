/** @format */

const { Markup } = require("telegraf");
const BaseScene = require("telegraf/scenes/base");
// const Redis = require("ioredis");
// const redis = new Redis(process.env.REDIS_HOST, process.env.REDIS_PORT);

// Scene for collecting user's education level
const getEducationLevelScene = new BaseScene("getEducationLevel");

getEducationLevelScene.enter((ctx) => {
  ctx.reply("Please select your education level:", {
    reply_markup: Markup.keyboard([
      ["I can write and read"],
      ["High school graduate"],
      ["Bachelor's degree"],
      ["Master's degree"],
      ["Doctorate"],
      ["Other"],
    ])
      .resize()
      .oneTime(),
  });
});

getEducationLevelScene.hears(/^(.*)$/, async (ctx) => {
  const educationLevel = ctx.match[1];

  // Save the education level in the session
  ctx.session.educationLevel = educationLevel;

  // Reply with a confirmation message
  await ctx.reply(`Your education level is ${educationLevel}.`);

  ctx.session.educationLevel = educationLevel;

  // Save all session information in Redis
  const phoneNumber = ctx.session.phoneNumber;
  const role = ctx.session.role;
  const age = ctx.session.age;
  const language = ctx.session.language;

  // Save the session information to Redis
  const userKey = `user:${phoneNumber}`;
  const redisData = {
    role,
    age,
    language,
    educationLevel,
  };

  console.log(redisData);

  // await redis.set(`${userKey}:role`, redisData.role);
  // await redis.set(`${userKey}:age`, redisData.age);
  // await redis.set(`${userKey}:language`, redisData.language);
  // await redis.set(`${userKey}:educationLevel`, redisData.educationLevel);
  // leave the scene
  return ctx.scene.enter("getQuestionCategory");
});

module.exports = getEducationLevelScene;
