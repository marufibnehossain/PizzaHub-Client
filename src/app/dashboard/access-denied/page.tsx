import Link from "next/link";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { requireAuth } from "../../../lib/require-auth";

export default async function AccessDeniedPage() {
    const user = await requireAuth();

    return (
        <div className="flex min-h-[70vh] items-center justify-center">
            <section className="w-full max-w-lg rounded-3xl border bg-card p-6 text-center sm:p-10">
                <div className="mx-auto flex size-20 items-center justify-center rounded-3xl bg-destructive/10">
                    <ShieldAlert className="size-10 text-destructive" />
                </div>
                <p className="mt-6 font-accent text-2xl font-bold text-primary">
                    Restricted access
                </p>
                <h1 className="mt-2 font-heading text-4xl font-semibold tracking-tight">
                    Access denied.
                </h1>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    You don&apos;t have permission to access
                    this workspace. Please return to your
                    dashboard to continue.
                </p>
                <div className="mt-6 rounded-xl bg-secondary p-4">
                    <p className="text-xs text-muted-foreground">
                        Your current account role
                    </p>
                    <p className="mt-1 font-semibold capitalize">
                        {user.role}
                    </p>
                </div>
                <Link
                    href="/dashboard"
                    className="mt-8 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                    <ArrowLeft className="size-4" />
                    Back to Dashboard
                </Link>
            </section>
        </div>
    );
}