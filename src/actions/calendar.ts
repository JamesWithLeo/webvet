"use server";

import { auth } from "@/auth";
import { google } from "googleapis";

export async function addAppointmentToCalendar(formData: {
    id: string;
    title: string;
    start: Date;
    end: Date;
    description: string;
}) {
    const session = await auth();
    if (!session?.user?.accessToken) return { error: "Not authenticated" };

    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET
    );
    oauth2Client.setCredentials({ access_token: session.user.accessToken });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    const safeId = formData.id.replace(/-/g, "").toLowerCase();

    const eventData = {
        summary: formData.title,
        start: { dateTime: formData.start.toISOString() },
        end: { dateTime: formData.end.toISOString() },
        description: formData.description,
        status: "confirmed", // This restores cancelled events
    };

    try {
        // 1. Try to find if the event already exists (even if cancelled)
        const existingEvent = await calendar.events
            .get({
                calendarId: "primary",
                eventId: safeId,
            })
            .catch(() => null);

        if (existingEvent) {
            // 2. If it exists, use PATCH to update/restore it
            const response = await calendar.events.patch({
                calendarId: "primary",
                eventId: safeId,
                requestBody: eventData,
            });
            return {
                success: true,
                message: "Event restored/updated",
                link: response.data.htmlLink,
            };
        }

        // 3. If it doesn't exist, INSERT new
        const response = await calendar.events.insert({
            calendarId: "primary",
            requestBody: {
                id: safeId,
                ...eventData,
            },
        });

        return { success: true, link: response.data.htmlLink };
    } catch (error: any) {
        console.error("Calendar Error:", error);
        return { error: error.message || "Failed to sync calendar" };
    }
}

export async function checkAppointmentFromCalendar(formData: {
    id: string;
    title: string;
}) {
    const session = await auth();
    if (!session?.user.accessToken) return { error: "Not authenticated" };

    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET
    );
    oauth2Client.setCredentials({ access_token: session.user.accessToken });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    // IMPORTANT: Google ID must be lowercase and is often picky about special characters.
    // Standard UUIDs (with dashes) usually work, but it's safer to strip them
    // or ensure they are compliant.
    const safeId = formData.id.replace(/-/g, "").toLowerCase();
    try {
        const response = await calendar.events.get({
            calendarId: "primary",
            eventId: safeId,
        });

        if (response.data.status === "cancelled") {
            return { existing: false };
        }

        return { existing: Boolean(response.data.start) };
    } catch (error: any) {
        if (error.code === 404) {
            console.error(
                "Event not found in Google Calendar. It may have been deleted."
            );
            // Logic: Clean up your DB or return a custom error to the UI
        } else {
            throw error; // Rethrow other unexpected errors (auth, network, etc.)
        }
        return { existing: false, error: error };
    }
}
