import { Client } from "@upstash/qstash";

export const qstash = new Client({ token: process.env.QSTASH_TOKEN! });

await qstash.schedules.create({
    destination: "https://josephmary.me/api/cron/incoming",
    cron: "CRON_TZ=Asia/Manila */5 * * * *",
    delay: "15s",
    headers: {
        "Content-Type": "application/json",
    },
});
