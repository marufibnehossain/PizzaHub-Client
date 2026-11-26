"use client";

import { Menu } from "lucide-react";
import type { DashboardUser } from "../../types/dashboard";
import { Button } from "../ui/button";
import Logo from "../shared/Logo";

interface DashboardHeaderProps {
    user: DashboardUser;
    onMenuClick: () => void;
}

export default function DashboardHeader({user, onMenuClick}: DashboardHeaderProps) {
    return (
        <header className="sticky top-0 z-30 flex h-18 items-center justify-between gap-4 border-b bg-background px-4 md:px-6 lg:px-8">
            <div className="flex items-center gap-3 lg:hidden">
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={onMenuClick}
                    aria-label="Open dashboard navigation"
                    className="size-10 shrink-0 cursor-pointer rounded-lg"
                >
                    <Menu className="size-5" />
                </Button>

                <Logo />
            </div>

            <div className="hidden lg:block">
                <h2 className="font-heading text-xl font-semibold">
                    Dashboard
                </h2>

                <p className="text-xs capitalize text-muted-foreground">
                    {user.role} workspace
                </p>
            </div>

            <div className="flex items-center gap-3">

                <div className="hidden text-right sm:block">
                    <p className="text-sm font-semibold">
                        {user.name}
                    </p>

                    <p className="text-xs capitalize text-muted-foreground">
                        {user.role}
                    </p>
                </div>

                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/15 font-heading text-lg font-semibold text-foreground">
                    {user.name.charAt(0).toUpperCase() || "U"}
                </div>
            </div>
        </header>
    );
}