/** @format */

const { Markup } = require("telegraf");
const BaseScene = require("telegraf/scenes/base");


const contactScene = new BaseScene("contact");

// Scene for collecting user contact information
contactScene.enter((ctx) => {
  ctx.session.lastScene = ctx.scene.current ? ctx.scene.current.id : null;
  ctx.reply(
    "Please share your contact so that we can contact you in case of any questions.",
    {
      reply_markup: {
        keyboard: [
          [
            {
              text: "Request Contact",
              request_contact: true,
            },
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

contactScene.on("contact", async (ctx) => {
  if(ctx.message.contact){
  const userPhoneNumber = ctx.message.contact.phone_number;
  if (userPhoneNumber) {
    // Check if the user is a Super Admin
    const superAdminPhoneNumbers =
      process.env.SUPER_ADMIN_PHONE_NUMBERS.split(",");
    if (superAdminPhoneNumbers.includes(userPhoneNumber)) {
    
    } else {
      // User is not a Super Admin
      const userKey = `user:${userPhoneNumber}`;
      const doctorKey = `doctor:${userPhoneNumber}`;
      // console.log(redis);
      const userExists = await redis.exists(userKey);
      const doctorExists = await redis.exists(doctorKey);
     
        console.log(ctx.session)
        ctx.session.phoneNumber = userPhoneNumber;
      }
    
  } else {
    await ctx.reply("Please provide your phone number to continue.");
  }}
});

contactScene.hears("Add Doctor", async (ctx) => {
  // Move to the doctor name scene
  await ctx.scene.enter("doctorName");
});
contactScene.hears("/start", async (ctx) => {
  await ctx.scene.leave("role");
});
module.exports = contactScene;
