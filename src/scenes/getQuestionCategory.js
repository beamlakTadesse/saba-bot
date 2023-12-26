/** @format */

const { Markup } = require("telegraf");
const { match, reply } = require("telegraf-i18n");
const BaseScene = require("telegraf/scenes/base");

// Scene for collecting user's age
const getQuestion = new BaseScene("getQuestionCategory");
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
getQuestion.enter(async (ctx) => {
  setLan(ctx)
  ctx.reply(
    ctx.i18n.t("What is your question about?") +
      "\n\n" +
      ctx.i18n.t("For example: Menstruation/Your period") +
      +`\n\n` +
      ctx.i18n.t("Data already entered:") +
      "\n" +
      ctx.i18n.t("Age:") +
      " " +
      ctx.session.age +
      "\n" +
      ctx.i18n.t("Education level:") +
      " " +
      ctx.session.educationLevel +
      +`\n` +
      ctx.i18n.t("Sex:") +
      " " +
      ctx.session.sex +
      "\n" +
      ctx.i18n.t("Language:") +
      " " +
      ctx.session.language,
    {
      reply_markup: {
        keyboard: [
          [ctx.i18n.t("Menstruation/Your period")],
          [ctx.i18n.t("Family planning/Contraception")],
          [ctx.i18n.t("Sexual Health")],
          [ctx.i18n.t("Self care")],
          [ctx.i18n.t("Sexual and reproductive rights")],
          [ctx.i18n.t("Mental Health")],
          [ctx.i18n.t("Fertility")],
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    }
  );
  //   ctx.scene.enter("conversation");
});
getQuestion.hears(/^(.*)$/, async (ctx) => {
  const questionCat = ctx.match[1];
  setLan(ctx)

  ctx.session.questionCat = questionCat;
  ctx.reply(ctx.i18n.t("You can ask your question now"), {
    // reply_markup: {
    //   keyboard: [
    //     [ctx.i18n.t("Back")],
    //     [ctx.i18n.t("Erase everything")],
    //     [ctx.i18n.t("To Main Menu")],
    //   ],
    //   resize_keyboard: true,
    //   one_time_keyboard: true,
    // },
  });
  await ctx.scene.leave("getQuestionCategory");
  ctx.scene.enter("getQuestion");

  console.log(ctx.session.questionCat);
});
// getQuestion.hears(match("Back"), async (ctx) => {
//   await ctx.scene.leave("getQuestionCategory");
//   ctx.scene.enter("getEducationLevel");
// });

// getQuestion.hears([match("Erase everything"), "/start"], async (ctx) => {
//   ctx.session = {};
//   // ctx.reply(
//   //   "Hello " + "!\n\nPlease choose if you are a consultant or a client",
//   //   {
//   //     reply_markup: {
//   //       keyboard: [["👩‍⚕️ Consultant", "👩‍🦰 Client"]],
//   //       resize_keyboard: true,
//   //       one_time_keyboard: true,
//   //     },
//   //   }
//   // );
//   await ctx.scene.leave("getQuestionCategory");
// });

// getQuestion.hears(match("To Main Menu"), async (ctx) => {
//   // ctx.reply(
//   //   "Hello " + "!\n\nPlease choose if you are a consultant or a client",
//   //   {
//   //     reply_markup: {
//   //       keyboard: [["👩‍⚕️ Consultant", "👩‍🦰 Client"]],
//   //       resize_keyboard: true,
//   //       one_time_keyboard: true,
//   //     },
//   //   }
//   // );
//   await ctx.scene.leave("getLangs");
// });
// console.log(match('Menstruation/Your period'))
// getQuestion.hears(match('Menstruation/Your period'), async (ctx) => {
//   console.log("....................")

// ctx.session.questionCat = "Menstruation/Your period";
// ctx.reply(ctx.i18n.t("You can ask your question now"), {
//   reply_markup: {
//     keyboard: [[ctx.i18n.t("Back")], [ctx.i18n.t("Erase everything")], [ctx.i18n.t("To Main Menu")]],
//     resize_keyboard: true,
//     one_time_keyboard: true,
//   },
// });
// await ctx.scene.leave("getQuestionCategory");
// ctx.scene.enter("getQuestion");
// });

// getQuestion.hears(["Family planning/Contraception", "/start"], async (ctx) => {
//   ctx.session.questionCat = "Family planning/Contraception";
//   ctx.reply(ctx.i18n.t("You can ask your question now"), {
//     reply_markup: {
//       keyboard: [[ctx.i18n.t("Back")], [ctx.i18n.t("Erase everything")], [ctx.i18n.t("To Main Menu")]],
//       resize_keyboard: true,
//       one_time_keyboard: true,
//     },
//   });
//   await ctx.scene.leave("getQuestionCategory");
//   ctx.scene.enter("getQuestion");
// });

// getQuestion.hears(["Sexual health", "/start"], async (ctx) => {
//   ctx.session.questionCat = "Sexual health";
//   ctx.reply(ctx.i18n.t("You can ask your question now"), {
//     reply_markup: {
//       keyboard: [[ctx.i18n.t("Back")], [ctx.i18n.t("Erase everything")], [ctx.i18n.t("To Main Menu")]],
//       resize_keyboard: true,
//       one_time_keyboard: true,
//     },
//   });
//   await ctx.scene.leave("getQuestionCategory");
//   ctx.scene.enter("getQuestion");
// });

// getQuestion.hears(["Self care", "/start"], async (ctx) => {
//   ctx.session.questionCat = "Self care";
//   ctx.reply(ctx.i18n.t("You can ask your question now"), {
//     reply_markup: {
//       keyboard: [[ctx.i18n.t("Back")], [ctx.i18n.t("Erase everything")], [ctx.i18n.t("To Main Menu")]],
//       resize_keyboard: true,
//       one_time_keyboard: true,
//     },
//   });
//   await ctx.scene.leave("getQuestionCategory");
//   ctx.scene.enter("getQuestion");
// });

// getQuestion.hears(["Fertility", "/start"], async (ctx) => {
//   ctx.session.questionCat = "Fertility";
//   ctx.reply(ctx.i18n.t("You can ask your question now"), {
//     reply_markup: {
//       keyboard: [[ctx.i18n.t("Back")], [ctx.i18n.t("Erase everything")], [ctx.i18n.t("To Main Menu")]],
//       resize_keyboard: true,
//       one_time_keyboard: true,
//     },
//   });
//   await ctx.scene.leave("getQuestionCategory");
//   ctx.scene.enter("getQuestion");
// });

// getQuestion.hears(["Mental Health", "/start"], async (ctx) => {
//   ctx.session.questionCat = "Mental Health";
//   ctx.reply(ctx.i18n.t("You can ask your question now"), {
//     reply_markup: {
//       keyboard: [[ctx.i18n.t("Back")], [ctx.i18n.t("Erase everything")], [ctx.i18n.t("To Main Menu")]],
//       resize_keyboard: true,
//       one_time_keyboard: true,
//     },
//   });
//   await ctx.scene.leave("getQuestionCategory");
//   ctx.scene.enter("getQuestion");
// });

// getQuestion.hears(["Other", "/start"], async (ctx) => {
//   ctx.session.questionCat = "Other";
//   ctx.reply(ctx.i18n.t("You can ask your question now"), {
//     reply_markup: {
//       keyboard: [[ctx.i18n.t("Back")], [ctx.i18n.t("Erase everything")], [ctx.i18n.t("To Main Menu")]],
//       resize_keyboard: true,
//       one_time_keyboard: true,
//     },
//   });
//   await ctx.scene.leave("getQuestionCategory");
//   ctx.scene.enter("getQuestion");
// });

// getQuestion.hears(["Sexual and reproductive rights", "/start"], async (ctx) => {
//   ctx.session.questionCat = "Sexual and reproductive rights";
//   ctx.reply(ctx.i18n.t("You can ask your question now"), {
//     reply_markup: {
//       keyboard: [[ctx.i18n.t("Back")], [ctx.i18n.t("Erase everything")], [ctx.i18n.t("To Main Menu")]],
//       resize_keyboard: true,
//       one_time_keyboard: true,
//     },
//   });
//   await ctx.scene.leave("getQuestionCategory");
//   ctx.scene.enter("getQuestion");
// });

// getQuestion.hears("text", async (ctx) => {
//   ctx.session.questionCat = ctx.message.text;
//   ctx.reply(ctx.i18n.t("You can ask your question now"), {
//     reply_markup: {
//       keyboard: [[ctx.i18n.t("Back")], [ctx.i18n.t("Erase everything")], ["⬅️ To Main Menu"]],
//       resize_keyboard: true,
//       one_time_keyboard: true,
//     },
//   });
//   await ctx.scene.leave("getQuestionCategory");
//   ctx.scene.enter("getQuestion");
// });

module.exports = getQuestion;
