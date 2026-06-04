import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
    const { nextUrl } = req;
    const user = req.auth?.user;
    const role = user?.role;
    const pathname = nextUrl.pathname;

    const isProfileIncomplete =
        user && (!user.firstName || !user.lastName || !user.contactNumber);

    const isSetupPage = pathname === "/v1/auth/setup";

    // 1. Profile Setup Guard (Highest Priority)
    if (isProfileIncomplete) {
        if (isSetupPage) return NextResponse.next();
        return NextResponse.redirect(new URL("/v1/auth/setup", nextUrl));
    }

    // 2. Prevent Profiled users from going back to Setup
    if (!isProfileIncomplete && isSetupPage) {
        return NextResponse.redirect(new URL("/", nextUrl)); // This will then trigger Landing Logic below
    }

    // 3. Consolidated Landing Logic
    // Only redirect if they are at the "Root" or "Clinic Root"
    const rootPaths = ["/", "/v1", "/v1/clinic"];
    if (user && rootPaths.includes(pathname)) {
        const dashboardMap = {
            admin: "/v1/clinic/dashboard",
            staff: "/v1/clinic/appointments",
            vet: "/v1/clinic/treatment-board",
            client: "/v1/dashboard",
        };
        const target =
            (role && dashboardMap[role as keyof typeof dashboardMap]) ||
            "/v1/dashboard";
        return NextResponse.redirect(new URL(target, nextUrl));
    }

    // 4. Role-Based Route Protection
    const adminOnlyRoutes = ["calendar", "sales", "services", "dashboard"];
    const pathSegments = pathname.split("/");
    const lastSegment = pathSegments[pathSegments.length - 1];

    // forbid the diff roles from admin only routes
    if (
        pathname.startsWith("/v1/clinic") &&
        adminOnlyRoutes.includes(lastSegment) &&
        role !== "admin"
    ) {
        // Only redirect if they aren't ALREADY at their safe fallback
        if (role === "vet" && lastSegment !== "treatment-board") {
            return NextResponse.redirect(
                new URL("/v1/clinic/treatment-board", nextUrl)
            );
        }
        if (role === "staff" && lastSegment !== "appointments") {
            return NextResponse.redirect(
                new URL("/v1/clinic/appointments", nextUrl)
            );
        }
        // If they are a client or something else trying to access clinic routes
        if (role !== "vet" && role !== "staff") {
            return NextResponse.redirect(new URL("/v1/dashboard", nextUrl));
        }
    }

    return NextResponse.next();
});
export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
