import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getAppointments } from "@/lib/db/appointments";

export const GET = auth(async function GET(req) {
    const { searchParams } = new URL(req.url);
    const ownerId = searchParams.get("id");

    // 1. Validation: Ensure the ID exists before checking auth
    if (!ownerId) {
        return NextResponse.json(
            { error: "Bad Request", details: "ownerId is required" },
            { status: 400 }
        );
    }

    // 2. Authorization: Check session and ownership
    const isAuthorized = req.auth?.user?.id === ownerId;
    if (!isAuthorized) {
        return NextResponse.json(
            {
                error: "Unauthorized",
                details: "You do not have access to these records",
            },
            { status: 401 }
        );
    }
    try {
        const { data, error: dbError } = await getAppointments({ id: ownerId });

        // Handle logical errors returned by the DB function (common in Supabase-style libs)
        if (dbError) {
            console.error("Fetch Error:", dbError);
            return NextResponse.json(
                { error: "Data Retrieval Failed", details: dbError },
                { status: 500 }
            );
        }

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        // 4. Panic Catch: Handle unexpected crashes (Network, Syntax, etc.)
        console.error("Unhandled API Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
});
