"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, LoaderCircle } from "lucide-react";
import { authClient } from "../../lib/auth-client";
import { DASHBOARD_NAVIGATION, ACCOUNT_NAVIGATION } from "../../constants/dashboard";
import type { DashboardUser, DashboardNavItem } from "../../types/dashboard";
import { Button } from "../ui/button";
import Logo from "../shared/Logo";

interface DashboardSidebarProps {
    user: DashboardUser;
    onNavigate?: () => void;
}

interface NavigationItemProps {
    item: DashboardNavItem;
    pathname: string;
    onNavigate?: () => void;
}

function NavigationItem({ item, pathname, onNavigate, }: NavigationItemProps) {
    const Icon = item.icon;

    const isActive =
        item.href === "/dashboard" || item.href === "/"
            ? pathname === item.href
            : pathname === item.href ||
              pathname.startsWith(`${item.href}/`);

    const baseClasses = "flex min-h-11 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors";

    if (!item.enabled) {
        return (
            <span
                aria-disabled="true"
                className={`${baseClasses} cursor-not-allowed text-muted-foreground opacity-60`}
                title="Coming soon"
            >
                <Icon className="size-4 shrink-0" />

                <span className="flex-1">
                    {item.label}
                </span>

                <span className="text-[10px]">
                    Soon
                </span>
            </span>
        );
    }

    return (
        <Link
            href={item.href}
            onClick={onNavigate}
            aria-current={isActive ? "page" : undefined}
            className={`${baseClasses} ${isActive ? "bg-accent font-semibold text-accent-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}>
            <Icon className={`size-4 shrink-0 ${isActive ? "text-primary" : ""}`} />
            <span>{item.label}</span>
        </Link>
    );
}

export default function DashboardSidebar({ user, onNavigate }: DashboardSidebarProps) {
    const pathname = usePathname();
    const router = useRouter();

    const [isSigningOut, setIsSigningOut] =
        useState<boolean>(false);

    const [errorMessage, setErrorMessage] =
        useState<string>("");

    const navigation =
        DASHBOARD_NAVIGATION[user.role];

    const handleSignOut = async (): Promise<void> => {
        setIsSigningOut(true);
        setErrorMessage("");

        try {
            const { error } = await authClient.signOut();

            if (error) {
                setErrorMessage(
                    error.message || "Failed to sign out."
                );
                return;
            }

            onNavigate?.();

            router.replace("/sign-in");
            router.refresh();

        } catch {
            setErrorMessage(
                "Something went wrong. Please try again."
            );
        } finally {
            setIsSigningOut(false);
        }
    };

    return (
        <aside className="flex h-full min-h-0 w-full flex-col bg-background">
            <div className="border-b px-6 py-6">
                <Logo href="/dashboard" />

                <p className="mt-3 text-xs capitalize text-muted-foreground">
                    {user.role} workspace
                </p>
            </div>

            <div className="flex-1 space-y-8 overflow-y-auto px-4 py-6">

                <div>
                    <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                        Workspace
                    </p>

                    <nav
                        aria-label="Workspace navigation"
                        className="space-y-1"
                    >
                        {navigation.map((item) => (
                            <NavigationItem
                                key={item.href}
                                item={item}
                                pathname={pathname}
                                onNavigate={onNavigate}
                            />
                        ))}
                    </nav>
                </div>

                <div>
                    <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                        Account
                    </p>

                    <nav
                        aria-label="Account navigation"
                        className="space-y-1"
                    >
                        {ACCOUNT_NAVIGATION.map((item) => (
                            <NavigationItem
                                key={item.href}
                                item={item}
                                pathname={pathname}
                                onNavigate={onNavigate}
                            />
                        ))}
                    </nav>
                </div>
            </div>

            <div className="space-y-4 border-t p-4">

                <div className="flex items-center gap-3 rounded-xl bg-secondary p-3">

                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/15 font-heading text-lg font-semibold text-foreground">
                        {user.name.charAt(0).toUpperCase() || "U"}
                    </div>

                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">
                            {user.name}
                        </p>

                        <p className="truncate text-xs text-muted-foreground">
                            {user.email}
                        </p>
                    </div>
                </div>

                {errorMessage && (
                    <p
                        role="alert"
                        className="text-xs text-destructive"
                    >
                        {errorMessage}
                    </p>
                )}

                <Button
                    type="button"
                    variant="ghost"
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                    className="h-11 w-full cursor-pointer justify-start gap-3 rounded-lg text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                    {isSigningOut ? (
                        <LoaderCircle className="size-4 animate-spin" />
                    ) : (
                        <LogOut className="size-4" />
                    )}

                    {isSigningOut
                        ? "Signing out..."
                        : "Sign out"}
                </Button>
            </div>
        </aside>
    );
}