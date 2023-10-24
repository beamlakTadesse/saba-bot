/** @format */

const { Markup } = require("telegraf");
const BaseScene = require("telegraf/scenes/base");
const axios = require("axios");
const doctorPhoneNumberScene = new BaseScene("doctorPhoneNumber");
const apiUrl = " http://5.75.155.116:8000/v1/doctors";
doctorPhoneNumberScene.enter((ctx) => {
  // ctx.reply("Please enter the doctor's phone number:");
  ctx.reply(
    "Please share your contact so that we can confirm you are a registered doctor.",
    {
      reply_markup: {
        keyboard: [
          [
            {
              text: "Request Contact",
              request_contact: true,
            },
          ],
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    }
  );
});

// Handle user response for deleting existing doctor and adding a new one
doctorPhoneNumberScene.hears("Yes", async (ctx) => {
  const doctorKey = ctx.session.doctorKey;
  var doctorName = ctx.session.doctorName;
  console.log(ctx);
  var postData = {
    name: doctorName,
    phone: ctx.session.doctorPhoneNumber,
    role: "Doctor",
    status: "Active",
    alive: true,
    telegramId: ctx.session.doctorId,
  };
  axios
    .patch(apiUrl + `/${ctx.session.doctorPhoneNumber}`, postData)
    .then((response) => {
      ctx.reply(`Wellcome doctor ${response.data.name}`);
      ctx.scene.enter("doctorListening");
    })
    .catch((error) => {
      ctx.reply(`Sorry something went wrong try again`);
      // Handle any errors that occurred during the request
      console.error("Error:", error.message);
    });

  // Clear the doctor-related session data
  delete ctx.session.doctorName;
  delete ctx.session.doctorPhoneNumber;
});

// Handle user response for not deleting existing doctor
doctorPhoneNumberScene.hears("No", async (ctx) => {
  await ctx.reply("No changes were made. Existing doctor details remain.");
  var postData = {
    status: "Active",
    alive: true,
    telegramId: ctx.session.doctorId,
  };

  axios
    .patch(apiUrl + `/${ctx.session.doctorPhoneNumber}`, postData)
    .then((response) => {
      ctx.reply(`Wellcome doctor ${response.data.name}`);
      ctx.scene.enter("doctorListening");
    })
    .catch((error) => {
      
      ctx.reply(`Sorry something went wrong try again`);
      // Handle any errors that occurred during the request
      console.error("Error:", error.message);
    });
  // ctx.scene.enter("doctorListening");
});

async function saveDoctorDetails(ctx) {
  const doctorKey = `doctor:${ctx.message.text}`;
  const existingDoctor = await redis.get(doctorKey);

  if (existingDoctor) {
    // Doctor with the same key already exists
    await ctx.reply(
      "Wellcome Doctor. Do you want to update your profile?",
      {
        reply_markup: Markup.keyboard([["Yes", "No"]])
          .resize()
          .oneTime(),
      }
    );
    // Save the doctor key in the session for future reference
    ctx.session.doctorKey = doctorKey;
  } else {
    // No existing doctor with the same key, proceed with saving
    await saveNewDoctor(ctx, doctorKey);
  }
}



doctorPhoneNumberScene.on("contact", async (ctx) => {
  const userPhoneNumber = ctx.message.contact.phone_number;
  ctx.session.doctorPhoneNumber = userPhoneNumber;
  console.log(userPhoneNumber);
  if (userPhoneNumber) {
    // Check if the user is a Super Admin
    const superAdminPhoneNumbers =
      process.env.SUPER_ADMIN_PHONE_NUMBERS.split(",");
    
      console.log("call api and check");
      console.log(ctx.session.doctorPhoneNumber);

      const pathVariable1 = userPhoneNumber;

      const path = `/${pathVariable1}`;

      axios
        .get(`${apiUrl}${path}`)
        .then((response) => {
          ctx.reply(
            ``,
            {
              reply_markup: {
                keyboard: [["Yes"], ["No"]],
                resize_keyboard: true,
                one_time_keyboard: true,
              },
            }
          );
        })
        .catch((error) => {
       
              ctx.reply(`Sorry you have to be registerd member to access this bot as a doctor.`);
              // Handle any errors that occurred during the request
              console.error("Error:", error.message);
          
        });
    // }
  } else {
    await ctx.reply("Please provide your phone number to continue.");
  }
});

module.exports = doctorPhoneNumberScene;
