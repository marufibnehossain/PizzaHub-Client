import { requireRole } from "../../../../lib/require-auth";

import ImageUploadTest from "../../../../components/dashboard/ImageUploadTest";

export default async function TestUploadPage() {
    await requireRole("vendor");

    return (
        <div className="space-y-6">

            <div>
                <p className="font-accent text-2xl font-bold text-primary">
                    Vendor workspace
                </p>

                <h1 className="mt-1 font-heading text-3xl font-semibold tracking-tight">
                    Image Upload Test
                </h1>

                <p className="mt-2 text-sm text-muted-foreground">
                    Test product image uploads before creating menu items.
                </p>
            </div>

            <ImageUploadTest />

        </div>
    );
}