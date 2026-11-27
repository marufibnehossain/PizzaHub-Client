import { authClient } from "../auth-client";

import type { SubscriptionInfo, SubscriptionInfoResponse } from "../../types/subscription";

export const getVendorSubscription = async (): Promise<SubscriptionInfo> => {
    const { data, error } = await authClient.token();

    if (error || !data?.token) {
        throw new Error("Unable to verify your session.");
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendors/me/subscription`,{
        method: "GET",
        headers: {
            Authorization: `Bearer ${data.token}`,
        },
        cache: "no-store",
    });

    const result: SubscriptionInfoResponse = await response.json();

    if (!response.ok || !result.success || !result.data) {
        throw new Error(result.message || "Failed to retrieve subscription.");
    }

    return result.data;
};