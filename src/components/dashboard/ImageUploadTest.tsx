"use client";

import { useState } from "react";
import ImageUploader from "../shared/ImageUploader";

export default function ImageUploadTest() {
    const [images, setImages] = useState<string[]>([]);

    const [isUploading, setIsUploading] = useState<boolean>(false);

    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <section className="rounded-2xl border bg-card p-6">
                <ImageUploader
                    images={images}
                    onChange={setImages}
                    onUploadingChange={setIsUploading}
                />
            </section>

            <section className="rounded-2xl border bg-card p-6">
                <h2 className="font-heading text-lg font-semibold">
                    Upload result
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    These URLs will eventually be stored in MongoDB.
                </p>
                <div className="mt-4 rounded-xl bg-secondary p-4">
                    <p className="text-sm font-medium">
                        Upload status
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {isUploading
                            ? "Uploading..."
                            : "Ready"}
                    </p>
                </div>

                <pre className="mt-4 overflow-x-auto whitespace-pre-wrap break-all rounded-xl bg-secondary p-4 text-xs">
                    {JSON.stringify(images, null, 2)}
                </pre>

            </section>

        </div>
    );
}