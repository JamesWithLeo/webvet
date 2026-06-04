import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

let ratelimitInstance: Ratelimit | null = null;

export function getRateLimit() {
    if (!ratelimitInstance) {
        // We initialize inside the function to guarantee process.env is ready
        const redis = new Redis({
            url: process.env.UPSTASH_REDIS_REST_URL,
            token: process.env.UPSTASH_REDIS_REST_TOKEN,
        });

        ratelimitInstance = new Ratelimit({
            redis: redis,
            limiter: Ratelimit.slidingWindow(5, "1 m"),
            analytics: true,
            prefix: "@upstash/ratelimit",
        });
    }
    return ratelimitInstance;
}
