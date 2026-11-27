import { authClient } from "../auth-client";
import type { CreateMenuItemInput, MenuItem, MenuItemResponse } from "../../types/menu";

export const createMenuItem = async (menuItem: CreateMenuItemInput): Promise<MenuItem> => {
    const { data, error } = await authClient.token();

    if (error || !data?.token) {
        throw new Error("Unable to verify your session. Please sign in again.");
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/menu-items`,{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.token}`,
        },
        body: JSON.stringify(menuItem),
    });

    const result: MenuItemResponse = await response.json();

    if (!response.ok || !result.success || !result.data) {
        throw new Error(result.message || "Failed to create menu item.");
    }

    return result.data;
};