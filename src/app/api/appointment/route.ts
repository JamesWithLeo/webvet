// app/api/appointment/route.ts

import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const body = await request.json();
    console.log("Received date on server:", body);

    // You can save to DB or return a response
    return NextResponse.json({ status: "success", received: body });
}
