import { requireRole } from "../../../../lib/require-auth";
import AddMenuItemForm from "../../../../components/dashboard/vendor/AddMenuItemForm";

export default async function AddMenuItemPage() {
    await requireRole("vendor");

    return (
        <div className="space-y-6">

            <div>
                <p className="font-accent text-2xl font-bold text-primary">
                    Grow your menu
                </p>

                <h1 className="mt-1 font-heading text-3xl font-semibold tracking-tight md:text-4xl">
                    Add Menu Item
                </h1>

                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Create something delicious for your
                    customers and submit it for approval.
                </p>
            </div>

            <AddMenuItemForm />

        </div>
    );
}