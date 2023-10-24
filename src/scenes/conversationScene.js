/** @format */
const { default: axios } = require("axios");

const { Markup } = require("telegraf");
const BaseScene = require("telegraf/scenes/base");
// const Redis = require("ioredis");
// const redis = new Redis(process.env.REDIS_HOST, process.env.REDIS_PORT);

const conversationScene = new BaseScene("conversation");
const setLan=(ctx)=>{
  const language = ctx.session.language;

  if (language == "english") {
    ctx.i18n.locale("en");
  } else if (language == "amharic") {
    ctx.i18n.locale("am");
  } else if (language == "oromifa") {
    ctx.i18n.locale("or");
  } else if (language == "tigrgna") {
    ctx.i18n.locale("tr");
  } else {
    ctx.i18n.locale("en");
  }
}
conversationScene.hears("Finish", async (ctx) => {
  setLan(ctx)
  ctx.reply(
    "Thank you for using Ask Saba, you can ask another question or go back to the main menu",
    {
      reply_markup: {
        keyboard: [["Ask another question"], ["⬅️ To Main Menu"], ["Finish"]],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    }
  );

  if (ctx.session.doctor) {
    ctx.telegram.sendMessage(
      ctx.session.doctor.telegramId,
      "The client has ended the conversation, you can now answer another question by clicking on finish"
    );
    ctx.session.doctor.telegramId = -1;
  }
  ctx.scene.leave("conversation");
return  ctx.scene.enter("getQuestionCategory");

});

conversationScene.hears("Ask another question", async (ctx) => {
  setLan(ctx)

  ctx.reply(
    "What is your question about? \n\nFor example: Menstruation/Your period" +
      `\n\nData already entered:\nAge: ${ctx.session.age};\nEducation level: ${ctx.session.educationLavel};` +
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
          ["Finish"],
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    }
  );
  await ctx.scene.leave("conversation");
  ctx.scene.enter("getQuestionCat");
});

conversationScene.hears("⬅️ To Main Menu", async (ctx) => {
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
  await ctx.scene.leave("conversation");
});

conversationScene.on("text", async (ctx) => {
  setLan(ctx)

  console.log(ctx.session.doctor);
  if (ctx.session.doctor) {
    ctx.telegram.sendMessage(
      ctx.session.doctor.telegramId,
      ctx.i18n.t('New message from your client:')+'\n\n'+ctx.message.text
    );
  } else {
    axios
      .get(` http://5.75.155.116:8000/v1/doctors?alive=true&status=Active`)
      .then((response) => {
        let doctor = response.data.results[0];
        if (doctor) {
          axios
            .patch(` http://5.75.155.116:8000/v1/doctors/${doctor.phone}`, {
              status: "Busy",
            })
            .then((response) => {
              console.log(response.telegramId);
              ctx.telegram.sendMessage(
                response.telegramId,
                ctx.i18n.t('New message from your client:') +' '+'\n\n' + ctx.message.text
              );
            })
            .catch((error) => {
              ctx.reply(ctx.i18n.t(`Sorry something went wrong try again`));
              // Handle any errors that occurred during the request
              console.error("Error:", error.message);
            });
        } else {
          ctx.reply(ctx.i18n.t(`We'll get back to you with answers in a while.`));
          axios
            .post(` http://5.75.155.116:8000/v1/questions`, {
              question: ctx.session.question,
              questionCategory: ctx.session.questionCat,
              sex: ctx.session.sex,
              age: ctx.session.age,
              educationLevel: ctx.session.educationLevel,
              langs: ctx.session.language,
              userId: ctx.from.id,
              sent: false,
            })
            .then((response) => {
              console.log(response.data);
            })
            .catch((error) => {
              ctx.reply(ctx.i18n.t(`Sorry something went wrong try again`));
              // Handle any errors that occurred during the request
              console.error("Error:", error.message);
            });
        }
      })
      .catch((error) => {
        ctx.reply(ctx.i18n.t(`Sorry something went wrong try again`));
        // Handle any errors that occurred during the request
        console.error("Error:", error.message);
      });
  }
  ctx.reply(ctx.i18n.t("Your message has been sent to the Consultant"), {
    reply_markup: {
      keyboard: [["Finish"]],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  });
});

module.exports = conversationScene;
