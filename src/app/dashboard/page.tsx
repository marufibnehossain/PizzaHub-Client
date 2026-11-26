import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Store, ShoppingBag, ShieldCheck, UserRound } from "lucide-react";
import { auth } from "../../lib/auth";

export default async function DashboardPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/sign-in");
    }

    if (session.user.isBlocked === true) {
        redirect("/");
    }

    const role = session.user.role;

    if (role !== "customer" && role !== "vendor" && role !== "admin") {
        redirect("/");
    }

    const firstName =
        session.user.name.trim().split(/\s+/)[0] || "there";

    const isVendor = role === "vendor";
    const isAdmin = role === "admin";

    const WorkspaceIcon = isVendor
        ? Store
        : isAdmin
            ? ShieldCheck
            : ShoppingBag;

    const description = isVendor ? "Manage your menu, reach more customers and grow your business with PizzaHub." : isAdmin ? "Monitor your marketplace and keep PizzaHub running smoothly." : "Manage your orders and discover delicious food from local restaurants.";

    return (
        <div className="space-y-6">
            <div>
                <p className="font-accent text-2xl font-bold text-primary">
                    Your PizzaHub workspace
                </p>

                <h1 className="mt-1 font-heading text-3xl font-semibold tracking-tight md:text-4xl">
                    Welcome back, {firstName}!
                </h1>

                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {description}
                </p>
            </div>

            <section className="relative overflow-hidden rounded-3xl border bg-secondary p-6 md:p-10">
                <div className="pointer-events-none absolute -right-12 -top-12 size-64 rounded-full bg-primary/5" />

                <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">

                    <div className="max-w-lg">
                        <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold capitalize text-foreground">
                            {role} workspace
                        </span>

                        <h2 className="mt-5 font-heading text-3xl font-semibold tracking-tight">
                            {isVendor
                                ? "Your kitchen. Your business."
                                : isAdmin
                                    ? "A better marketplace starts here."
                                    : "Good food, great moments."}
                        </h2>

                        <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                            {isVendor
                                ? "Your workspace brings menu management, customer orders and subscriptions together in one place."
                                : isAdmin
                                    ? "Manage users, review menu submissions and monitor marketplace activity from your workspace."
                                    : "Your workspace brings your account and pizza orders together in one convenient place."}
                        </p>

                        <Link
                            href="/"
                            className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                        >
                            Visit PizzaHub
                            <ArrowRight className="size-4" />
                        </Link>
                    </div>

                    <div className="flex justify-center md:justify-end">
                        <div className="flex size-32 items-center justify-center rounded-3xl bg-primary/10 md:size-40">
                            <WorkspaceIcon className="size-16 text-primary md:size-20" />
                        </div>
                    </div>
                </div>
            </section>

            <section className="grid gap-4 md:grid-cols-2">

                <div className="rounded-2xl border bg-card p-6">
                    <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10">
                        <UserRound className="size-5 text-primary" />
                    </div>

                    <h3 className="mt-4 font-heading text-lg font-semibold">
                        Account information
                    </h3>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Your current PizzaHub account.
                    </p>

                    <dl className="mt-5 space-y-3 text-sm">
                        <div>
                            <dt className="text-muted-foreground">
                                Full name
                            </dt>

                            <dd className="mt-1 font-medium">
                                {session.user.name}
                            </dd>
                        </div>

                        <div>
                            <dt className="text-muted-foreground">
                                Email address
                            </dt>

                            <dd className="mt-1 break-all font-medium">
                                {session.user.email}
                            </dd>
                        </div>
                    </dl>
                </div>

                <div className="rounded-2xl border bg-card p-6">
                    <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10">
                        <WorkspaceIcon className="size-5 text-primary" />
                    </div>

                    <h3 className="mt-4 font-heading text-lg font-semibold">
                        Your workspace
                    </h3>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Information about your account access.
                    </p>

                    <dl className="mt-5 space-y-3 text-sm">
                        <div>
                            <dt className="text-muted-foreground">
                                Account role
                            </dt>

                            <dd className="mt-1 font-medium capitalize">
                                {role}
                            </dd>
                        </div>

                        <div>
                            <dt className="text-muted-foreground">
                                Account status
                            </dt>

                            <dd className="mt-1 font-medium text-success">
                                Active
                            </dd>
                        </div>
                    </dl>
                </div>

            </section>
        </div>
    );
}