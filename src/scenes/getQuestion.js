/** @format */

const { default: axios } = require("axios");
const { Markup } = require("telegraf");
const BaseScene = require("telegraf/scenes/base");
const apiUrl = " http://51.20.255.208:3000/v1/doctors";
// Scene for collecting user's age
const getQuestion = new BaseScene("getQuestion");
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
getQuestion.hears("Back", async (ctx) => {
  ctx.reply(
    "What is your question about? \n\nFor example: Menstruation/Your period" +
      `\n\nData already entered:\nAge: ${ctx.session.age};`+`\nEducation level: ${ctx.session.educationLevel};` +
      `\nSex: ${ctx.session.sex};\nLanguage: ${ctx.session.language}`,
    {
      reply_markup: {
        keyboard: [
          [ctx.i18n.t("Menstruation/Your period")],
          [ctx.i18n.t("Family planning/Contraception")],
          [ctx.i18n.t("Sexual health")],
          [ctx.i18n.t("Self care")],
          [ctx.i18n.t("Sexual and reproductive rights")],
          [ctx.i18n.t("Mental Health")],
          [ctx.i18n.t("Fertility")],
          ["Back"],
          ["Erase everything"],
          ["To Main Menu"],
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    }
  );
  await ctx.scene.leave("getQuestion");
  ctx.scene.enter("getQuestionCategory");
});

getQuestion.hears(["Erase everything", "/start"], async (ctx) => {
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
  await ctx.scene.leave("role");
});

getQuestion.hears(["To Main Menu"], async (ctx) => {
  await ctx.scene.leave("role");
});

getQuestion.on("text", async (ctx) => {
  if( "/start"===ctx.message.text){
    await ctx.scene.leave("role");
  }
  ctx.session.question = ctx.message.text;
  ctx.session.patientId = ctx.from.id;
  console.log("patient id log.....", ctx.session.patientId);
  setLan(ctx)

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
    .get(
      ` http://51.20.255.208:3000/v1/doctors?alive=true&status=Active&language=${ctx.session.language}`
    )
    .then((response) => {
      let doctor = response.data.results[0];
   console.log(doctor)
      if (doctor) {
        try{
          ctx.telegram.sendMessage(
           "340857074",
            ctx.i18n.t("New question from a client with information:") +' '+
              "\n" +
              ctx.i18n.t("Age:") +" "+
              ctx.session.age +
              ";\n" +
              ctx.i18n.t("Sex:") +" "+
              ctx.session.sex +
              ";\n" +
              ctx.i18n.t("Education level:") +' ' +
              ctx.session.educationLevel +
              ";\n" +
              ctx.i18n.t("Language:") +" " +
              ctx.session.language +
              ";\n" +
              ctx.i18n.t("With a question about") +" "+
              ctx.session.questionCat +
              ";\n\n" +
              ctx.i18n.t("And the question is") +" "+
              ctx.session.question +
              ";\n\n"
          );
        }catch(e){
          doctor= response.data.results[1];
          ctx.telegram.sendMessage(
            doctor.telegramId,
            ctx.i18n.t("New question from a client with information:") +' '+
              "\n" +
              ctx.i18n.t("Age:") +" "+
              ctx.session.age +
              ";\n" +
              ctx.i18n.t("Sex:") +" "+
              ctx.session.sex +
              ";\n" +
              ctx.i18n.t("Education level:") +' ' +
              ctx.session.educationLevel +
              ";\n" +
              ctx.i18n.t("Language:") +" " +
              ctx.session.language +
              ";\n" +
              ctx.i18n.t("With a question about") +" "+
              ctx.session.questionCat +
              ";\n\n" +
              ctx.i18n.t("And the question is") +" "+
              ctx.session.question +
              ";\n\n"
          );
        }
        axios
          .patch(` http://51.20.255.208:3000/v1/doctors/${doctor.phone}`, {
            status: "Busy",
            patientId: ctx.from.id,
          })
          .then((res) => {

            ctx.session.doctor = doctor;
            doctor.patientId = ctx.from.id;
            ctx.session.patientId = ctx.from.id;
           
           
          })
          .catch((error) => {
            ctx.reply(ctx.i18n.t(`Sorry something went wrong try again`));
            // Handle any errors that occurred during the request
            console.error("Error updating doctor status:", error.message);
          });
        axios
          .post(` http://51.20.255.208:3000/v1/questions`, {
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
            ctx.reply( ctx.i18n.t('Sorry something went wrong, try again'));
            // Handle any errors that occurred during the request
            console.error("Error posting question:", error.message);
          });
        ctx.reply(ctx.i18n.t("A doctor will be with you in a moment"));
      } else {
        axios
          .post(` http://51.20.255.208:3000/v1/questions`, {
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
            console.error("Error posting question:", error.message);
          });
        ctx.reply(ctx.i18n.t(`We'll get back to you with answers in a while`));
      }
    })
    .catch((error) => {
      ctx.reply(ctx.i18n.t(`Sorry something went wrong try again`));
      // Handle any errors that occurred during the request
      console.error("Error gething doctor:", error.message);
    });

  await ctx.scene.leave("getQuestion");
  ctx.scene.enter("conversation");
});

module.exports = getQuestion;
