import { validateImage } from "./validate-image";
import type { ImageUploadResponse } from "../types/image";

export const uploadImage = async (file: File): Promise<string> => {
    const validationError = validateImage(file);

    if (validationError) {
        throw new Error(validationError);
    }

    const formData = new FormData();

    formData.append("image", file);

    const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
    });

    const result: ImageUploadResponse =
        await response.json();

    if (!response.ok || !result.success || !result.data?.url) {
        throw new Error(result.message || "Failed to upload image.");
    }

    return result.data.url;
};