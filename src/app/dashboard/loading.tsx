export default function DashboardLoading() {
    return (
        <div
            role="status"
            aria-label="Loading dashboard"
            className="space-y-6"
        >
            <div className="animate-pulse space-y-6 motion-reduce:animate-none">

                <div className="space-y-3">
                    <div className="h-5 w-44 rounded-lg bg-secondary" />

                    <div className="h-9 w-64 max-w-full rounded-lg bg-secondary" />

                    <div className="h-4 w-96 max-w-full rounded-lg bg-secondary" />
                </div>

                <div className="h-64 rounded-3xl bg-secondary" />

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="h-52 rounded-2xl bg-secondary" />

                    <div className="h-52 rounded-2xl bg-secondary" />
                </div>
            </div>

            <span className="sr-only">
                Loading your dashboard...
            </span>
        </div>
    );
}