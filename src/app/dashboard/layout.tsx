import type { ReactNode } from "react";

import { requireAuth } from "../../lib/require-auth";
import DashboardShell from "../../components/dashboard/DashboardShell";

interface DashboardLayoutProps {
    children: ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
    const user = await requireAuth();

    return (
        <DashboardShell user={user}>
            {children}
        </DashboardShell>
    );
}