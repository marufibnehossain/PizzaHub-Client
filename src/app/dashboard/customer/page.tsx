import { requireRole } from "../../../lib/require-auth";

export default async function CustomerPage() {
    const user = await requireRole("customer");

    return (
        <section className="rounded-2xl border bg-card p-6">
            <h1 className="font-heading text-3xl font-semibold">
                Customer Workspace
            </h1>

            <p className="mt-3 text-muted-foreground">
                Welcome, {user.name}.
            </p>

            <p className="mt-2 text-sm font-medium text-success">
                Customer authorization successful.
            </p>
        </section>
    );
}