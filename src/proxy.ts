// proxy.ts
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;
    const role = req.auth?.user?.role;

    // 1. Initial Landing Logic
    if (
        isLoggedIn &&
        (nextUrl.pathname === "/" || nextUrl.pathname.startsWith("/v1/auth"))
    ) {
        if (role === "admin")
            return NextResponse.redirect(
                new URL("/v1/clinic/dashboard", nextUrl)
            );
        if (role === "staff")
            return NextResponse.redirect(
                new URL("/v1/clinic/appointments", nextUrl)
            );
        if (role === "vet")
            return NextResponse.redirect(
                new URL("/v1/clinic/treatment-board", nextUrl)
            );
        return NextResponse.redirect(new URL("/v1/clinic/dashboard", nextUrl));
    }

    // unauthorized
    if (!isLoggedIn && nextUrl.pathname.startsWith("/v1/clinic")) {
        return NextResponse.redirect(new URL("/", nextUrl));
    }

    // 2. Role-Based Route Protection
    // Prevent Vets or Staff from hitting Admin routes
    // if (nextUrl.pathname.startsWith("/admin") && role !== "admin") {
    //     const fallback = role === "vet" ? "/treatment-board" : "/dashboard";
    //     return NextResponse.redirect(new URL(fallback, nextUrl));
    // }
});

export const config = {
    // The matcher remains exactly the same
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
