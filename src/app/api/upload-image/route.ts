import { NextRequest, NextResponse } from "next/server";

import { auth } from "../../../lib/auth";
import { validateImage } from "../../../lib/validate-image";

import type { ImgBBResponse, ImageUploadResponse } from "../../../types/image";

export async function POST(request: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: request.headers,
            query: {
                disableCookieCache: true,
            },
        });

        if (!session) {
            return NextResponse.json<ImageUploadResponse>(
                {
                    success: false,
                    message: "Unauthorized.",
                },
                { status: 401 }
            );
        }

        if (session.user.role !== "vendor" || session.user.isBlocked === true) {
            return NextResponse.json<ImageUploadResponse>(
                {
                    success: false,
                    message: "You are not allowed to upload images.",
                },
                { status: 403 }
            );
        }

        const apiKey = process.env.IMGBB_API_KEY;

        if (!apiKey) {
            return NextResponse.json<ImageUploadResponse>(
                {
                    success: false,
                    message: "Image upload is not configured.",
                },
                { status: 500 }
            );
        }

        const formData = await request.formData();

        const image = formData.get("image");

        if (!(image instanceof File)) {
            return NextResponse.json<ImageUploadResponse>(
                {
                    success: false,
                    message: "Please provide a valid image.",
                },
                { status: 400 }
            );
        }

        const validationError = validateImage(image);

        if (validationError) {
            return NextResponse.json<ImageUploadResponse>(
                {
                    success: false,
                    message: validationError,
                },
                { status: 400 }
            );
        }

        const uploadData = new FormData();

        uploadData.append("image", image);

        const response = await fetch(
            `https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`,
            {
                method: "POST",
                body: uploadData,
            }
        );

        const result: ImgBBResponse = await response.json();

        if (!response.ok || !result.success || !result.data?.url) {
            return NextResponse.json<ImageUploadResponse>(
                {
                    success: false,
                    message: "Failed to upload image. Please try again.",
                },
                { status: 502 }
            );
        }

        return NextResponse.json<ImageUploadResponse>(
            {
                success: true,
                message: "Image uploaded successfully.",
                data: {
                    url: result.data.url,
                },
            },
            { status: 200 }
        );

    } catch (error: unknown) {
        console.error("Image upload failed.");

        return NextResponse.json<ImageUploadResponse>(
            {
                success: false,
                message: "Something went wrong while uploading the image.",
            },
            { status: 500 }
        );
    }
}