/** @format */
const { default: axios } = require("axios");

const { Markup } = require("telegraf");
const BaseScene = require("telegraf/scenes/base");

// Scene for collecting user's age
const doctorListening = new BaseScene("doctorListening");

doctorListening.enter(async (ctx) => {
  ctx.reply("Watting for a question...");
  axios
    .get(
      `https://saba-api.onrender.com/v1/doctors?telegramId=${ctx.session.doctorId}`
    )
    .then((response) => {
      console.log(response.data.results[4]);
      ctx.session.patientId = response.data.results[4].patientId;
    })
    .catch((error) => {
      // ctx.reply(`Sorry something went wrong try again`);
      // Handle any errors that occurred during the request
      console.error("Error:", error.message);
    });
});

doctorListening.hears("Finish", async (ctx) => {
  ctx.telegram.sendMessage(
    ctx.session.patientId,

    "The Consultant has ended the conversation. \n If you wanna learn more \n⬇️download our app on \nhttps://play.google.com/store/apps/details?id=org.saba.saba&pli=1 \nAnd stay tuned on \n📢 Saba Health channel https://t.me/sabahealth \n👥 Saba Health group https://t.me/sabatheapplication"
  );
  ctx.session.patientId = -1;
  console.log("doctor");

  console.log(ctx.session.doctorPhoneNumber);
  console.log(
    `https://saba-api.onrender.com/v1/doctors/${ctx.session.doctorPhoneNumber}`
  );
  axios
    .patch(
      `https://saba-api.onrender.com/v1/doctors/${ctx.session.doctorPhoneNumber}`,
      {
        status: "Active",
        patientId: -1,
      }
    )
    .then((response) => {
      axios
        .get("https://saba-api.onrender.com/v1/questions?sent=false")
        .then((res) => {
          if (res.results) {
            let question = res.results[0];
            ctx.telegram.sendMessage(
              doctor.telegramId,
              `New question from a client with information:\n
          Age: ${question.age};\n
          Sex: ${question.sex};\n
          Education level: ${question.educationLevel};\n
          language: ${question.language};\n
          With a question about: ${question.questionCategory};\n\n
          And the question is: ${question.question};\n\n
          `
            );
            axios
              .patch(
                `https://saba-api.onrender.com/v1/questions/${question.id}`,
                {
                  sent: true,
                }
              )
              .then((re) => {
                console.log(re);
              })
              .catch((e) => {
                console.log(e);
              });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((error) => {
      // Handle any errors that occurred during the request
      console.error("Error:", error.message);
    });
});

doctorListening.on("text", async (ctx) => {
  //   const patient = doctors.find((doctor) => doctor.id === ctx.from.id).patientId;
  //   if (!patient) {
  //     ctx.reply("You don't have any clients yet");
  //     return;
  //   }
  console.log("doctor response");
  console.log(ctx.message.from);

  console.log(ctx.session.patientId);
  if (ctx.session.patientId) {
    try {
      ctx.telegram.sendMessage(
        ctx.session.patientId,
        `New message from your Consultant:\n\n${ctx.message.text}`
      );
    } catch (error) {
      // Handle any errors that occurred during the request
      console.error("Error:", error);
    }
  }

  ctx.reply("Your message has been sent to the Consultant", {
    reply_markup: {
      keyboard: [["Finish"]],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  });
});
module.exports = doctorListening;
