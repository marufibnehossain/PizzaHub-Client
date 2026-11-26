import type { LucideIcon } from "lucide-react";
import type { UserRole } from "./auth";

export interface DashboardUser {
    id: string;
    name: string;
    email: string;
    role: UserRole;
}

export interface DashboardNavItem {
    label: string;
    href: string;
    icon: LucideIcon;
    enabled: boolean;
}