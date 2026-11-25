export type SubscriptionPlan = "free" | "premium";

export interface VendorSubscription {
  subscriptionPlan: SubscriptionPlan;
  subscriptionExpiresAt?: string | null;
}