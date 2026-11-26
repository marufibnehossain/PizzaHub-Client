import { NextRequest, NextResponse } from "next/server";
import { auth } from "./lib/auth";

export async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    const session = await auth.api.getSession({
        headers: request.headers,
        query: {
            disableCookieCache: true,
        },
    });

    if (!session) {
        return NextResponse.redirect(
            new URL("/sign-in", request.url)
        );
    }

    const role = session.user.role;

    if (session.user.isBlocked === true) {
        return NextResponse.redirect(
            new URL("/", request.url)
        );
    }

    if (role !== "customer" && role !== "vendor" && role !== "admin") {
        return NextResponse.redirect(
            new URL("/", request.url)
        );
    }

    if ((pathname === "/dashboard/vendor" || pathname === "/dashboard/vendor/") || pathname.startsWith("/dashboard/vendor") && role !== "vendor") {
        return NextResponse.redirect(
            new URL("/dashboard/access-denied", request.url)
        );
    }

    if ((pathname === "/dashboard/customer" || pathname === "/dashboard/customer/") || pathname.startsWith("/dashboard/customer") && role !== "customer") {
        return NextResponse.redirect(
            new URL("/dashboard/access-denied", request.url)
        );
    }

    if ((pathname === "/dashboard/admin" || pathname.startsWith("/dashboard/admin")) && role !== "admin") {
        return NextResponse.redirect(
            new URL("/dashboard/access-denied", request.url)
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*"],
};