"use server";

import webpush from "web-push";

import type { PushSubscription as WebPushSubscription } from "web-push";

webpush.setVapidDetails(
    "https://josephmary.me",
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
);

let subscription: WebPushSubscription | null = null;

export async function subscribeUser(sub: any) {
    subscription = sub as WebPushSubscription;
    return { success: true };
}

export async function unsubscribeUser() {
    subscription = null;
    return { success: true };
}

export async function sendNotification(title: string, message: string) {
    if (!subscription) {
        throw new Error("No subscription available");
    }

    try {
        await webpush.sendNotification(
            subscription, // Now the types match!
            JSON.stringify({
                title: title,
                body: message,
                icon: "/logo.svg",

                // todo: add dynamic routing
                // data: {
                // }
            })
        );
        return { success: true };
    } catch (error) {
        console.error("Error sending push notification:", error);
        return { success: false, error: "Failed to send notification" };
    }
}
