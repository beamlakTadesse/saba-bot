/** @format */

const { default: axios } = require("axios");
const { Markup } = require("telegraf");
const BaseScene = require("telegraf/scenes/base");
const apiUrl = "https://saba-api.onrender.com/v1/doctors";
// Scene for collecting user's age
const getQuestion = new BaseScene("getQuestion");

getQuestion.hears("◀️ Back", async (ctx) => {
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
  await ctx.scene.leave("getQuestion");
  ctx.scene.enter("getQuestionCategory");
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
  await ctx.scene.leave("getQuestion");
});

getQuestion.hears(["⬅️ To Main Menu"], async (ctx) => {
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
});

getQuestion.on("text", async (ctx) => {
  ctx.session.question = ctx.message.text;
  ctx.session.patientId = ctx.from.id;
  console.log("patient id log.....",ctx.session.patientId);

  let df = false;
  let askedAlready = false;
  // doctors.forEach((doctor) => {
  //   if (doctor.status === "free") {
  //     doctor.status = "busy";
  //     ctx.session.doctor = doctor.id;
  //     doctor.patientId = ctx.from.id;

  //     df = true;
  //     return;
  //   }
  // });

  axios
    .get(`https://saba-api.onrender.com/v1/doctors?alive=true&status=Active`)
    .then((response) => {
      let doctor = response.data.results[0];

      if (doctor) {
        axios
          .patch(`https://saba-api.onrender.com/v1/doctors/${doctor.phone}`, {
            status: "Busy",
            patientId: ctx.from.id,
          })
          .then((response) => {
            // doctor = { ...doctor, patientId: ctx.from.id };
            ctx.session.doctor = doctor;
            doctor.patientId = ctx.from.id;

            ctx.telegram.sendMessage(
              doctor.telegramId,
              `New question from a client with information:\n
          Age: ${ctx.session.age};\n
          Sex: ${ctx.session.sex};\n
          Education level: ${ctx.session.educationLevel};\n
          language: ${ctx.session.language};\n
          With a question about: ${ctx.session.questionCat};\n\n
          And the question is: ${ctx.session.question};\n\n
          `
            );
          })
          .catch((error) => {
            ctx.reply(`Sorry something went wrong try again`);
            // Handle any errors that occurred during the request
            console.error("Error:", error.message);
          });
        axios
          .post(`https://saba-api.onrender.com/v1/questions`, {
            question: ctx.session.question,
            questionCategory: ctx.session.questionCat,
            sex: ctx.session.sex,
            age: ctx.session.age,
            educationLevel: ctx.session.educationLevel,
            langs: ctx.session.language,
            userId: ctx.from.id,
          })
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            ctx.reply(`Sorry something went wrong try again`);
            // Handle any errors that occurred during the request
            console.error("Error:", error.message);
          });
        ctx.reply("A doctor will be with you in a moment");
      } else {
        axios
          .post(`https://saba-api.onrender.com/v1/questions`, {
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
            ctx.reply(`Sorry something went wrong try again`);
            // Handle any errors that occurred during the request
            console.error("Error:", error.message);
          });
        ctx.reply(`Well get back to you with answers in a while.`);
      }
    })
    .catch((error) => {
      ctx.reply(`Sorry something went wrong try again`);
      // Handle any errors that occurred during the request
      console.error("Error:", error.message);
    });

  await ctx.scene.leave("getQuestion");
  ctx.scene.enter("conversation");
});

module.exports = getQuestion;
