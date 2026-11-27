"use client";

import { useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { ImagePlus, Upload, Trash2, LoaderCircle, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "../ui/button";
import { MAX_MENU_IMAGES } from "../../constants/image";
import { uploadImage } from "../../lib/upload-image";
import { validateImage } from "../../lib/validate-image";
import Image from "next/image";

interface ImageUploaderProps {
    images: string[];
    onChange: (images: string[]) => void;
    onUploadingChange?: (isUploading: boolean) => void;
    disabled?: boolean;
}

export default function ImageUploader({ images, onChange, onUploadingChange, disabled = false }: ImageUploaderProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const remainingSlots = MAX_MENU_IMAGES - images.length;

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
        const files = Array.from(event.target.files || []);

        event.target.value = "";

        if (files.length === 0 || isUploading || disabled) {
            return;
        }

        setErrorMessage("");

        if (files.length > remainingSlots) {
            setErrorMessage(`You can upload up to ${remainingSlots} more image(s).`);
            return;
        }

        for (const file of files) {
            const error = validateImage(file);

            if (error) {
                setErrorMessage(error);
                return;
            }
        }

        setIsUploading(true);
        onUploadingChange?.(true);

        const uploadedUrls: string[] = [];

        try {
            for (const file of files) {
                const imageUrl = await uploadImage(file);

                uploadedUrls.push(imageUrl);
            }

        } catch (error: unknown) {
            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : "Failed to upload images."
            );

        } finally {
            if (uploadedUrls.length > 0) {
                onChange([...images, ...uploadedUrls]);
            }

            setIsUploading(false);
            onUploadingChange?.(false);
        }
    };

    const handleRemoveImage = (index: number): void => {
        const updatedImages = images.filter(
            (_, imageIndex) => imageIndex !== index
        );

        onChange(updatedImages);
        setErrorMessage("");
    };

    return (
        <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h3 className="font-heading text-lg font-semibold">
                        Product images
                    </h3>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Add clear, appetizing photos of your menu item.
                    </p>
                </div>

                <span className="shrink-0 rounded-full bg-secondary px-3 py-1 text-xs font-medium">
                    {images.length} / {MAX_MENU_IMAGES}
                </span>
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handleFileChange}
                disabled={disabled || isUploading || remainingSlots <= 0}
                className="hidden"
            />

            <div className="flex flex-col items-center rounded-2xl border-2 border-dashed bg-muted p-6 text-center transition-colors sm:p-10">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10">
                    {isUploading ? (
                        <LoaderCircle className="size-7 animate-spin text-primary" />
                    ) : (
                        <ImagePlus className="size-7 text-primary" />
                    )}
                </div>

                <h4 className="mt-4 font-heading text-lg font-semibold">
                    {isUploading
                        ? "Uploading your images..."
                        : remainingSlots <= 0
                            ? "Image limit reached"
                            : "Upload product images"}
                </h4>

                <p className="mt-1 text-sm text-muted-foreground">
                    {remainingSlots <= 0
                        ? "Remove an image to upload another."
                        : "Choose images from your device."}
                </p>

                <Button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={
                        disabled || isUploading || remainingSlots <= 0
                    }
                    className="mt-5 cursor-pointer rounded-full px-6"
                >
                    {isUploading ? (
                        <LoaderCircle className="size-4 animate-spin" />
                    ) : (
                        <Upload className="size-4" />
                    )}

                    {isUploading
                        ? "Uploading..."
                        : "Browse Files"}
                </Button>

                <p className="mt-4 text-xs text-muted-foreground">
                    JPG, PNG or WebP · Maximum 3 MB per image
                </p>
            </div>

            {errorMessage && (
                <div
                    role="alert"
                    className="flex items-start gap-2 rounded-xl bg-destructive/10 p-3 text-sm text-destructive"
                >
                    <AlertCircle className="mt-0.5 size-4 shrink-0" />

                    <p>{errorMessage}</p>
                </div>
            )}

            {images.length > 0 && (
                <div className="space-y-3">
                    {images.map((image, index) => (
                        <div
                            key={`${image}-${index}`}
                            className="flex items-center gap-3 rounded-xl border bg-card p-3"
                        >
                            <Image
                                src={image}
                                alt={`Product image ${index + 1}`}
                                width={80}
                                height={80}
                                className="size-20 shrink-0 rounded-lg object-cover"
                            />

                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold">
                                    Image {index + 1}
                                </p>

                                <div className="mt-1 flex items-center gap-1.5 text-xs text-success">
                                    <CheckCircle2 className="size-3.5 shrink-0" />

                                    Upload successful
                                </div>

                                {index === 0 && (
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Cover image
                                    </p>
                                )}
                            </div>

                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                disabled={disabled || isUploading}
                                onClick={() =>
                                    handleRemoveImage(index)
                                }
                                aria-label={`Remove image ${index + 1}`}
                                className="shrink-0 cursor-pointer text-destructive hover:bg-destructive/10 hover:text-destructive"
                            >
                                <Trash2 className="size-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}