// /** @format */

// const { Markup } = require("telegraf");
// const BaseScene = require("telegraf/scenes/base");
// const Redis = require("ioredis");
// const redis = new Redis(process.env.REDIS_HOST, process.env.REDIS_PORT);

// const adminHomeScene = new BaseScene("adminHome");

// // Scene for collecting user contact information
// adminHomeScene.enter(async (ctx) => {
//   await ctx.reply("Super Admin Home", {
//     reply_markup: Markup.keyboard([["Add Doctor", "Get Doctors List"]])
//       .resize()
//       .oneTime(),
//   });
// });

// adminHomeScene.hears("Add Doctor", async (ctx) => {
//   // Move to the doctor name scene
//   return await ctx.scene.enter("doctorName");
// });

// adminHomeScene.hears("Get Doctors List", async (ctx) => {
//   const doctors = await getDoctorsList();
//   console.log(doctors);
//   if (doctors.length > 0) {
//     const doctorList = doctors
//       .map(
//         (doctor, index) =>
//           `${index + 1}. ${doctor.name} ${doctor.phone} ${
//             doctor.availability ? "Available" : "Not Available"
//           }`
//       )
//       .join("\n");
//     await ctx.reply(`List of Doctors:\n${doctorList}`);
//   } else {
//     await ctx.reply("No doctors found.");
//   }
// });

// async function getDoctorsList() {
//   const doctorKeys = await redis.keys("doctor:*");
//   const doctors = [];
//   console.log(doctorKeys);
//   for (const key of doctorKeys) {
//     if (key.endsWith(":phone")) {
//       const doctorId = key.replace(":phone", "");
//       const nameKey = `${doctorId}:name`;
//       const phoneKey = `${doctorId}:phone`;
//       const availabilityKey = `${doctorId}:availability`;
//       const name = await redis.get(nameKey);
//       const phone = await redis.get(phoneKey);
//       const availability = await redis.get(availabilityKey);
//       console.log(nameKey, phoneKey, "test");
//       if (name && phone && availabilityKey) {
//         doctors.push({
//           phone,
//           name,
//           availability,
//         });
//       }
//     }
//   }

//   return doctors;
// }

// module.exports = adminHomeScene;
