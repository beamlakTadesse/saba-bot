/** @format */

const { Markup } = require("telegraf");
const BaseScene = require("telegraf/scenes/base");
// const Redis = require("ioredis");
// const redis = new Redis(process.env.REDIS_HOST, process.env.REDIS_PORT);

// Scene for collecting user's education level
const getEducationLevelScene = new BaseScene("getEducationLevel");

getEducationLevelScene.enter((ctx) => {
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

  ctx.reply(ctx.i18n.t("Please select your education level:"), {
    reply_markup: Markup.keyboard([
      [ctx.i18n.t("I can write and read")],
      [ctx.i18n.t("High school graduate")],
      [ctx.i18n.t("Bachelor's degree")],
      [ctx.i18n.t("Master's degree")],
      [ctx.i18n.t("Doctorate")],
      [ctx.i18n.t("Other")],
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
