import { Client } from "@upstash/qstash";

export const qstash = new Client({ token: process.env.QSTASH_TOKEN! });

// const schedules = await qstash.schedules.list();

// const alreadyExistsIncoming = schedules.find(
//     (s) => s.destination === "https://josephmary.me/api/cron/incoming"
// );

// const alreadyExistsMissed = schedules.find(
//     (s) => s.destination === "https://josephmary.me/api/cron/missed"
// );

// if (!alreadyExistsIncoming) {
//     await qstash.schedules.create({
//         destination: "https://josephmary.me/api/cron/incoming",
//         cron: "*/15 * * * *", // Changed to 15 to be safer
//     });
// }
// if (!alreadyExistsMissed) {
//     await qstash.schedules.create({
//         destination: "https://josephmary.me/api/cron/missed",
//         cron: "*/15 * * * *",
//     });
// }
