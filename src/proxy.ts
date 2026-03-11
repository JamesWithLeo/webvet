import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
    const { nextUrl } = req;
    const user = req.auth?.user;
    const role = user?.role;
    const pathname = nextUrl.pathname;

    const isProfileIncomplete =
        user &&
        (!user.firstName ||
            !user.lastName ||
            !user.dateOfBirth ||
            !user.gender);

    if (isProfileIncomplete && pathname !== "/v1/auth/setup") {
        return NextResponse.redirect(new URL("/v1/auth/setup", nextUrl));
    }

    //  Auth Guard: Protect clinic routes from unauthenticated users
    if (!user && pathname.startsWith("/v1/clinic")) {
        return NextResponse.redirect(new URL("/", nextUrl));
    }

    //  Initial Landing Logic: Redirect users from root to their specific dashboards
    const rootPaths = ["/", "/v1", "/v1/clinic"];
    if (user && rootPaths.includes(pathname)) {
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

        return NextResponse.redirect(new URL("/v1/dashboard", nextUrl));
    }

    const adminOnlyRoutes = ["calendar", "sales", "services", "dashboard"];
    const pathSegments = pathname.split("/");
    const lastSegment = pathSegments[pathSegments.length - 1]; // Safer than [-1]

    if (
        pathname.startsWith("/v1/clinic") &&
        adminOnlyRoutes.includes(lastSegment) &&
        role !== "admin"
    ) {
        if (role === "vet")
            return NextResponse.redirect(
                new URL("/v1/clinic/treatment-board", nextUrl)
            );
        if (role === "staff")
            return NextResponse.redirect(
                new URL("/v1/clinic/appointments", nextUrl)
            );

        return NextResponse.redirect(new URL("/v1/dashboard", nextUrl));
    }

    return NextResponse.next();
});

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
