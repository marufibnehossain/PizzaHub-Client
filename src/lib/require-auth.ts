import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";
import type { UserRole } from "../types/auth";
import type { DashboardUser } from "../types/dashboard";

export const requireAuth = async (): Promise<DashboardUser> => {
    const session = await auth.api.getSession({
        headers: await headers(),
        query: {
            disableCookieCache: true,
        },
    });

    if (!session) {
        redirect("/sign-in");
    }

    const user = session.user;

    if (user.isBlocked === true) {
        redirect("/");
    }

    if (user.role !== "customer" && user.role !== "vendor" && user.role !== "admin") {
        redirect("/");
    }

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    };
};

export const requireRole = async (requiredRole: UserRole): Promise<DashboardUser> => {
    const user = await requireAuth();

    if (user.role !== requiredRole) {
        redirect("/dashboard/access-denied");
    }

    return user;
};