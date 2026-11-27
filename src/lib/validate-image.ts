import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE } from "../constants/image";

export const validateImage = (file: File): string | null => {
    if (file.size === 0) {
        return "The selected image is empty.";
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        return "Only JPG, PNG and WebP images are allowed.";
    }

    if (file.size > MAX_IMAGE_SIZE) {
        return "Each image must be 3 MB or smaller.";
    }

    return null;
};