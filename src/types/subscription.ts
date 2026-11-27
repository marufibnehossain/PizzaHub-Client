export type SubscriptionPlan = "free" | "premium";

export interface VendorSubscription {
  subscriptionPlan: SubscriptionPlan;
  subscriptionExpiresAt?: string | null;
}

export interface SubscriptionInfo {
    plan: SubscriptionPlan;
    usedSlots: number;
    maxItems: number | null;
    remainingSlots: number | null;
    expiresAt: string | null;
}

export interface SubscriptionInfoResponse {
    success: boolean;
    message: string;
    data?: SubscriptionInfo;
}