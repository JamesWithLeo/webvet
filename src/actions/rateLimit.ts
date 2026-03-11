"use server";

import { ratelimit } from "@/lib/RateLimit";
import { headers } from "next/headers";

export async function checkAuthLimit(email: string) {
    // 1. Await the headers promise
    const headerList = await headers();

    // 2. Now you can use .get()
    const ip = headerList.get("x-forwarded-for") ?? "127.0.0.1";
    const identifier = `otp:${email}:${ip}`;

    const { success, reset } = await ratelimit.limit(identifier);

    return {
        success,
        retryInSeconds: Math.floor((reset - Date.now()) / 1000),
    };
}
