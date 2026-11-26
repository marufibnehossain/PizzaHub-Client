import type { ReactNode } from "react";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "../../lib/auth";
import type { DashboardUser } from "../../types/dashboard";
import DashboardShell from "../../components/dashboard/DashboardShell";

interface DashboardLayoutProps {
    children: ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/sign-in");
    }

    const role = session.user.role;

    if (
        role !== "customer" &&
        role !== "vendor" &&
        role !== "admin"
    ) {
        redirect("/");
    }

    if (session.user.isBlocked === true) {
        redirect("/");
    }

    const user: DashboardUser = {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: role,
    };

    return (
        <DashboardShell user={user}>
            {children}
        </DashboardShell>
    );
}