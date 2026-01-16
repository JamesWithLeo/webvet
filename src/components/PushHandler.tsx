"use client";
import { useEffect } from "react";

export default function PushHandler() {
    useEffect(() => {
        if ("serviceWorker" in navigator && "PushManager" in window) {
            // 1. Register the Service Worker
            navigator.serviceWorker.register("/sw.js").then((reg) => {
                console.log("SW Registered!");
            });
        }
    }, []);

    const subscribeUser = async () => {
        const registration = await navigator.serviceWorker.ready;

        // 2. Ask for permission
        const permission = await Notification.requestPermission();
        if (permission !== "granted") return alert("Permission denied");

        // 3. Get the subscription object
        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
            // You generate this
        });

        // 4. Send this "subscription" object to your backend (Vercel Postgres/KV)
        await fetch("/api/save-subscription", {
            method: "POST",
            body: JSON.stringify(subscription),
        });
    };

    return <button onClick={subscribeUser}>Enable Notifications</button>;
}
