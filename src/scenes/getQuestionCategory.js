/** @format */

const { Markup } = require("telegraf");
const BaseScene = require("telegraf/scenes/base");

// Scene for collecting user's age
const getQuestion = new BaseScene("getQuestionCategory");

getQuestion.enter(async (ctx) => {
  ctx.reply(
    "What is your question about? \n\nFor example: Menstruation/Your period" +
      `\n\nData already entered:\nAge: ${ctx.session.age};\nEducation level: ${ctx.session.educationLevel};` +
      `\nSex: ${ctx.session.sex};\nLanguage: ${ctx.session.language}`,
    {
      reply_markup: {
        keyboard: [
          ["Menstruation/Your period"],
          ["Family planning/Contraception"],
          ["Sexual health"],
          ["Self care"],
          ["Sexual and reproductive rights"],
          ["Mental Health"],
          ["Fertility"],
          ["◀️ Back"],
          ["❌ Erase everything"],
          ["⬅️ To Main Menu"],
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    }
  );
  //   ctx.scene.enter("conversation");
});

getQuestion.hears("◀️ Back", async (ctx) => {
  ctx.reply(
    "What languages ​​do you speak? \n\nFor example: Amharic - Native" +
      `\n\nData already entered:\nAge: ${ctx.session.year};\nEducation level: ${ctx.session.educ};` +
      `\nSex: ${ctx.session.theme}`,
    {
      reply_markup: {
        keyboard: [["◀️ Back"], ["❌ Erase everything"], ["⬅️ To Main Menu"]],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    }
  );
  await ctx.scene.leave("getQuestionCategory");
  ctx.scene.enter("getEducationLevel");
});

getQuestion.hears(["❌ Erase everything", "/start"], async (ctx) => {
  ctx.session = {};
  // ctx.reply(
  //   "Hello " + "!\n\nPlease choose if you are a consultant or a client",
  //   {
  //     reply_markup: {
  //       keyboard: [["👩‍⚕️ Consultant", "👩‍🦰 Client"]],
  //       resize_keyboard: true,
  //       one_time_keyboard: true,
  //     },
  //   }
  // );
  await ctx.scene.leave("getQuestionCategory");
});

getQuestion.hears("⬅️ To Main Menu", async (ctx) => {
  // ctx.reply(
  //   "Hello " + "!\n\nPlease choose if you are a consultant or a client",
  //   {
  //     reply_markup: {
  //       keyboard: [["👩‍⚕️ Consultant", "👩‍🦰 Client"]],
  //       resize_keyboard: true,
  //       one_time_keyboard: true,
  //     },
  //   }
  // );
  await ctx.scene.leave("getLangs");
});

getQuestion.hears(["Menstruation/Your period", "/start"], async (ctx) => {
  ctx.session.questionCat = "Menstruation/Your period";
  ctx.reply("You can ask your question now", {
    reply_markup: {
      keyboard: [["◀️ Back"], ["❌ Erase everything"], ["⬅️ To Main Menu"]],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  });
  await ctx.scene.leave("getQuestionCategory");
  ctx.scene.enter("getQuestion");
});

getQuestion.hears(["Family planning/Contraception", "/start"], async (ctx) => {
  ctx.session.questionCat = "Family planning/Contraception";
  ctx.reply("You can ask your question now", {
    reply_markup: {
      keyboard: [["◀️ Back"], ["❌ Erase everything"], ["⬅️ To Main Menu"]],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  });
  await ctx.scene.leave("getQuestionCategory");
  ctx.scene.enter("getQuestion");
});

getQuestion.hears(["Sexual health", "/start"], async (ctx) => {
  ctx.session.questionCat = "Sexual health";
  ctx.reply("You can ask your question now", {
    reply_markup: {
      keyboard: [["◀️ Back"], ["❌ Erase everything"], ["⬅️ To Main Menu"]],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  });
  await ctx.scene.leave("getQuestionCategory");
  ctx.scene.enter("getQuestion");
});

getQuestion.hears(["Self care", "/start"], async (ctx) => {
  ctx.session.questionCat = "Self care";
  ctx.reply("You can ask your question now", {
    reply_markup: {
      keyboard: [["◀️ Back"], ["❌ Erase everything"], ["⬅️ To Main Menu"]],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  });
  await ctx.scene.leave("getQuestionCategory");
  ctx.scene.enter("getQuestion");
});

getQuestion.hears(["Fertility", "/start"], async (ctx) => {
  ctx.session.questionCat = "Fertility";
  ctx.reply("You can ask your question now", {
    reply_markup: {
      keyboard: [["◀️ Back"], ["❌ Erase everything"], ["⬅️ To Main Menu"]],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  });
  await ctx.scene.leave("getQuestionCategory");
  ctx.scene.enter("getQuestion");
});

getQuestion.hears(["Mental Health", "/start"], async (ctx) => {
  ctx.session.questionCat = "Mental Health";
  ctx.reply("You can ask your question now", {
    reply_markup: {
      keyboard: [["◀️ Back"], ["❌ Erase everything"], ["⬅️ To Main Menu"]],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  });
  await ctx.scene.leave("getQuestionCategory");
  ctx.scene.enter("getQuestion");
});

getQuestion.hears(["Other", "/start"], async (ctx) => {
  ctx.session.questionCat = "Other";
  ctx.reply("You can ask your question now", {
    reply_markup: {
      keyboard: [["◀️ Back"], ["❌ Erase everything"], ["⬅️ To Main Menu"]],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  });
  await ctx.scene.leave("getQuestionCategory");
  ctx.scene.enter("getQuestion");
});

getQuestion.hears(["Sexual and reproductive rights", "/start"], async (ctx) => {
  ctx.session.questionCat = "Sexual and reproductive rights";
  ctx.reply("You can ask your question now", {
    reply_markup: {
      keyboard: [["◀️ Back"], ["❌ Erase everything"], ["⬅️ To Main Menu"]],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  });
  await ctx.scene.leave("getQuestionCategory");
  ctx.scene.enter("getQuestion");
});

getQuestion.hears("text", async (ctx) => {
  ctx.session.questionCat = ctx.message.text;
  ctx.reply("You can ask your question now", {
    reply_markup: {
      keyboard: [["◀️ Back"], ["❌ Erase everything"], ["⬅️ To Main Menu"]],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  });
  await ctx.scene.leave("getQuestionCategory");
  ctx.scene.enter("getQuestion");
});

module.exports = getQuestion;
