/** @format */

const { Markup } = require("telegraf");
const BaseScene = require("telegraf/scenes/base");
const Redis = require("ioredis");
const redis = new Redis(process.env.REDIS_HOST, process.env.REDIS_PORT);

const contactScene = new BaseScene("contact");

// Scene for collecting user contact information
contactScene.enter((ctx) => {
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
          ],
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    }
  );
});

contactScene.on("contact", async (ctx) => {
  const userPhoneNumber = ctx.message.contact?.phone_number;
  if (userPhoneNumber) {
    // Check if the user is a Super Admin
    const superAdminPhoneNumbers =
      process.env.SUPER_ADMIN_PHONE_NUMBERS.split(",");
    // console.log(superAdminPhoneNumbers, userPhoneNumber);
    if (superAdminPhoneNumbers.includes(userPhoneNumber)) {
      // User is a Super Admin
      return ctx.scene.enter("adminHome");
    } else {
      // User is not a Super Admin
      const userKey = `user:${userPhoneNumber}`;
      const doctorKey = `doctor:${userPhoneNumber}`;
      // console.log(redis);
      const userExists = await redis.exists(userKey);
      const doctorExists = await redis.exists(doctorKey);
      // console.log(userExists);
      // console.log(userExists);
      // console.log(doctorExists);
      if (userExists) {
        ctx.session.phoneNumber = userPhoneNumber;
        ctx.session.role = await redis.get(`${userKey}:role`);
        ctx.session.age = await redis.get(`${userKey}:age`);
        ctx.session.language = await redis.get(`${userKey}:language`);
        ctx.session.educationLevel = await redis.get(
          `${userKey}:educationLevel`
        );

        await ctx.reply(`Welcome back user, ${userPhoneNumber}!`);
      } else if (doctorExists) {
        ctx.session.phoneNumber = userPhoneNumber;
        ctx.session.name = await redis.get(`${doctorExists}:name`);
        ctx.session.availability = await redis.get(
          `${doctorExists}:availability`
        );

        await ctx.reply(`Welcome back Dr ${ctx.session.name}!`);
      } else {
        ctx.session.phoneNumber = userPhoneNumber;
        return ctx.scene.enter("role");
      }
    }
  } else {
    await ctx.reply("Please provide your phone number to continue.");
  }
});

contactScene.hears("Add Doctor", async (ctx) => {
  // Move to the doctor name scene
  await ctx.scene.enter("doctorName");
});

module.exports = contactScene;
