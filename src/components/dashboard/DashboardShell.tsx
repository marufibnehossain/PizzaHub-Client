"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import type { DashboardUser } from "../../types/dashboard";
import DashboardSidebar from "./DashboardSidebar";
import DashboardHeader from "./DashboardHeader";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "../ui/sheet";

interface DashboardShellProps {
    user: DashboardUser;
    children: ReactNode;
}

export default function DashboardShell({
    user,
    children,
}: DashboardShellProps) {
    const [mobileMenuOpen, setMobileMenuOpen] =
        useState<boolean>(false);

    return (
        <div className="min-h-dvh bg-muted">

            <div className="fixed inset-y-0 left-0 hidden w-64 border-r lg:block">
                <DashboardSidebar user={user} />
            </div>

            <Sheet
                open={mobileMenuOpen}
                onOpenChange={setMobileMenuOpen}
            >
                <SheetContent
                    side="left"
                    className="w-72 max-w-[85vw] gap-0 p-0 lg:hidden"
                >
                    <SheetTitle className="sr-only">
                        Dashboard navigation
                    </SheetTitle>

                    <SheetDescription className="sr-only">
                        Navigate through your PizzaHub workspace.
                    </SheetDescription>

                    <DashboardSidebar
                        user={user}
                        onNavigate={() =>
                            setMobileMenuOpen(false)
                        }
                    />
                </SheetContent>
            </Sheet>

            <div className="min-w-0 lg:pl-64">

                <DashboardHeader
                    user={user}
                    onMenuClick={() =>
                        setMobileMenuOpen(true)
                    }
                />

                <main className="mx-auto w-full max-w-[1600px] p-4 md:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}