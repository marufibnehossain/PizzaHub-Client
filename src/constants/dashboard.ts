import { LayoutDashboard, Pizza, CirclePlus, ShoppingBag, Crown, Users, ClipboardCheck, CreditCard, UserRound, House } from "lucide-react";
import type { UserRole } from "../types/auth";
import type { DashboardNavItem } from "../types/dashboard";

export const DASHBOARD_NAVIGATION: Record<UserRole, DashboardNavItem[]> = {
    customer: [
        {
            label: "Overview",
            href: "/dashboard",
            icon: LayoutDashboard,
            enabled: true,
        },
        {
            label: "My Orders",
            href: "/dashboard/customer/orders",
            icon: ShoppingBag,
            enabled: false,
        },
    ],

    vendor: [
        {
            label: "Overview",
            href: "/dashboard",
            icon: LayoutDashboard,
            enabled: true,
        },
        {
            label: "My Menu",
            href: "/dashboard/vendor/menu",
            icon: Pizza,
            enabled: false,
        },
        {
            label: "Add Menu Item",
            href: "/dashboard/vendor/add-item",
            icon: CirclePlus,
            enabled: true,
        },
        {
            label: "Manage Orders",
            href: "/dashboard/vendor/orders",
            icon: ShoppingBag,
            enabled: false,
        },
        {
            label: "Subscription",
            href: "/dashboard/vendor/subscription",
            icon: Crown,
            enabled: false,
        },
    ],

    admin: [
        {
            label: "Overview",
            href: "/dashboard",
            icon: LayoutDashboard,
            enabled: true,
        },
        {
            label: "Manage Users",
            href: "/dashboard/admin/users",
            icon: Users,
            enabled: false,
        },
        {
            label: "Manage Menu",
            href: "/dashboard/admin/menu",
            icon: ClipboardCheck,
            enabled: false,
        },
        {
            label: "Transactions",
            href: "/dashboard/admin/transactions",
            icon: CreditCard,
            enabled: false,
        },
    ],
};

export const ACCOUNT_NAVIGATION: DashboardNavItem[] = [
    {
        label: "My Profile",
        href: "/dashboard/profile",
        icon: UserRound,
        enabled: false,
    },
    {
        label: "Back to Home",
        href: "/",
        icon: House,
        enabled: true,
    },
];