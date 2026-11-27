import { Crown, Store, AlertCircle } from "lucide-react";
import type { SubscriptionInfo } from "../../../types/subscription";

interface VendorSubscriptionCardProps {
    subscription: SubscriptionInfo;
}

export default function VendorSubscriptionCard({ subscription }: VendorSubscriptionCardProps) {
    const isPremium = subscription.plan === "premium";

    const limitReached = subscription.remainingSlots === 0;

    const usagePercentage = subscription.maxItems ? Math.min(100, (subscription.usedSlots / subscription.maxItems) * 100) : 0;

    return (
        <section className="rounded-2xl border bg-secondary p-5 md:p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${
                        isPremium ? "bg-premium/10 text-premium" : "bg-primary/10 text-primary"
                    }`}>
                        {isPremium ? (
                            <Crown className="size-6" />
                        ) : (
                            <Store className="size-6" />
                        )}
                    </div>
                    <div>
                        <h2 className="font-heading text-lg font-semibold">
                            {isPremium ? "Premium subscription" : "Free subscription"}
                        </h2>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                            {isPremium ? "Enjoy unlimited menu items." : `${subscription.remainingSlots} remaining menu slot(s).`}
                        </p>
                    </div>
                </div>
                <div className="text-sm font-semibold">
                    {isPremium ? "Unlimited" : `${subscription.usedSlots} / ${subscription.maxItems} slots used`}
                </div>
            </div>
            {!isPremium && (
                <div className="mt-5">
                    <div
                        role="progressbar"
                        aria-label="Menu slot usage"
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={Math.round(
                            usagePercentage
                        )}
                        className="h-2 overflow-hidden rounded-full bg-border"
                    >
                        <div
                            className={`h-full rounded-full transition-all duration-300 ${
                                limitReached
                                    ? "bg-destructive"
                                    : "bg-primary"
                            }`}
                            style={{width: `${usagePercentage}%`}}
                        />
                    </div>

                    {limitReached && (
                        <div className="mt-4 flex items-start gap-2 text-sm text-destructive">
                            <AlertCircle className="mt-0.5 size-4 shrink-0" />

                            <p>
                                Your menu limit has been reached.
                                Free up a slot or upgrade to
                                Premium to add more items.
                            </p>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}