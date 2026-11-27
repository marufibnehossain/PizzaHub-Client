"use client";

import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Send, LoaderCircle, ClipboardCheck, AlertCircle, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import ImageUploader from "../../shared/ImageUploader";
import VendorSubscriptionCard from "./VendorSubscriptionCard";
import { MENU_CATEGORIES } from "../../../types/menu";
import type { MenuFormValues, CreateMenuItemInput } from "../../../types/menu";
import type { SubscriptionInfo } from "../../../types/subscription";
import { MAX_MENU_IMAGES } from "../../../constants/image";
import { createMenuItem } from "../../../lib/api/menu";
import { getVendorSubscription } from "../../../lib/api/subscription";

const INITIAL_FORM_VALUES: MenuFormValues = {
    itemName: "",
    category: "",
    description: "",
    price: "",
    location: "",
};

export default function AddMenuItemForm() {
    const [formValues, setFormValues] = useState<MenuFormValues>(INITIAL_FORM_VALUES);
    const [images, setImages] = useState<string[]>([]);
    const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
    const [isLoadingSubscription, setIsLoadingSubscription] = useState<boolean>(true);
    const [subscriptionError, setSubscriptionError] = useState<string>("");
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [formError, setFormError] = useState<string>("");

    const loadSubscription = async (): Promise<void> => {
        setIsLoadingSubscription(true);
        setSubscriptionError("");

        try {
            const result = await getVendorSubscription();

            setSubscription(result);

        } catch (error: unknown) {
            setSubscription(null);

            setSubscriptionError(
                error instanceof Error
                    ? error.message
                    : "Failed to load subscription."
            );

        } finally {
            setIsLoadingSubscription(false);
        }
    };
    
    useEffect(() => {
        let ignore = false;

        const fetchSubscription = async (): Promise<void> => {
            try {
                const result = await getVendorSubscription();

                if (!ignore) {
                    setSubscription(result);
                }

            } catch (error: unknown) {
                if (!ignore) {
                    setSubscriptionError(
                        error instanceof Error
                            ? error.message
                            : "Failed to load subscription."
                    );
                }

            } finally {
                if (!ignore) {
                    setIsLoadingSubscription(false);
                }
            }
        };

        void fetchSubscription();

        return () => {
            ignore = true;
        };
    }, []);

    const limitReached = subscription?.remainingSlots === 0;

    const formDisabled = isLoadingSubscription || !subscription || limitReached || isSubmitting;

    const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        const { name, value } = event.target;

        setFormValues((previousValues) => ({
            ...previousValues,
            [name]: value,
        }));

        setFormError("");
    };

    const handleCategoryChange = (value: string | null): void => {
        const selectedCategory = MENU_CATEGORIES.find(
            (category) => category === value
        );

        setFormValues((previousValues) => ({
            ...previousValues,
            category: selectedCategory || "",
        }));

        setFormError("");
    };

    const resetForm = (): void => {
        setFormValues(INITIAL_FORM_VALUES);
        setImages([]);
        setFormError("");
    };

    const showFormError = (message: string): void => {
        setFormError(message);
        toast.error(message);
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();

        if (formDisabled || isUploading) {
            return;
        }

        setFormError("");

        const {itemName, category, description, price, location} = formValues;

        if (!itemName.trim() || !category || !description.trim() || !location.trim()) {
            showFormError("Please complete all required fields.");
            return;
        }

        const numericPrice = Number(price);

        if (!price.trim() || !Number.isFinite(numericPrice) || numericPrice <= 0) {
            showFormError("Please enter a valid positive price.");
            return;
        }

        if (images.length === 0) {
            showFormError("Please upload at least one product image.");
            return;
        }

        if (images.length > MAX_MENU_IMAGES) {
            showFormError("A maximum of three images is allowed.");
            return;
        }

        const menuItem: CreateMenuItemInput = {
            itemName: itemName.trim(),
            category,
            description: description.trim(),
            price: numericPrice,
            location: location.trim(),
            images,
        };

        setIsSubmitting(true);

        try {
            await createMenuItem(menuItem);

            toast.success("Menu item submitted!", {
                description:"Your product is now awaiting Admin approval.",
            });

            resetForm();

            await loadSubscription();

        } catch (error: unknown) {
            const message = error instanceof Error
                ? error.message
                : "Failed to create menu item.";

            showFormError(message);

            await loadSubscription();

        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">

            {isLoadingSubscription ? (
                <div
                    role="status"
                    className="animate-pulse space-y-4 rounded-2xl border bg-secondary p-6"
                >
                    <div className="h-6 w-48 max-w-full rounded-md bg-border" />
                    <div className="h-4 w-36 rounded-md bg-border" />
                    <div className="h-2 rounded-full bg-border" />

                    <span className="sr-only">
                        Loading subscription information...
                    </span>
                </div>
            ) : subscription ? (
                <VendorSubscriptionCard
                    subscription={subscription}
                />
            ) : (
                <section
                    role="alert"
                    className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border bg-card p-5"
                >
                    <div className="flex items-start gap-3">

                        <AlertCircle className="mt-0.5 size-5 shrink-0 text-destructive" />

                        <div>
                            <p className="font-semibold">
                                Unable to load subscription
                            </p>

                            <p className="mt-1 text-sm text-muted-foreground">
                                {subscriptionError}
                            </p>
                        </div>
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => void loadSubscription()}
                    >
                        <RotateCcw className="size-4" />
                        Retry
                    </Button>
                </section>
            )}

            <form
                onSubmit={handleSubmit}
                className="space-y-6"
            >
                <div className="grid items-start gap-6 xl:grid-cols-5">

                    <section className="space-y-6 rounded-2xl border bg-card p-5 md:p-6 xl:col-span-3">

                        <div>
                            <h2 className="font-heading text-xl font-semibold">
                                Basic information
                            </h2>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Tell us about your delicious creation.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="itemName">
                                Item name *
                            </Label>

                            <Input
                                id="itemName"
                                name="itemName"
                                value={formValues.itemName}
                                onChange={handleInputChange}
                                placeholder="e.g. Classic Margherita"
                                disabled={formDisabled}
                                required
                                className="h-11"
                            />
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">

                            <div className="min-w-0 space-y-2">

                                <Label htmlFor="category">
                                    Category *
                                </Label>

                                <Select
                                    value={formValues.category}
                                    onValueChange={
                                        handleCategoryChange
                                    }
                                    disabled={formDisabled}
                                    required
                                >
                                    <SelectTrigger
                                        id="category"
                                        className="w-full data-[size=default]:h-11"
                                    >
                                        <SelectValue
                                            placeholder="Select category"
                                        />
                                    </SelectTrigger>

                                    <SelectContent>
                                        {MENU_CATEGORIES.map(
                                            (category) => (
                                                <SelectItem
                                                    key={category}
                                                    value={category}
                                                >
                                                    {category}
                                                </SelectItem>
                                            )
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">

                                <Label htmlFor="price">
                                    Price (৳) *
                                </Label>

                                <Input
                                    id="price"
                                    name="price"
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    value={formValues.price}
                                    onChange={handleInputChange}
                                    placeholder="650"
                                    disabled={formDisabled}
                                    required
                                    className="h-11"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">

                            <Label htmlFor="location">
                                Location *
                            </Label>

                            <Input
                                id="location"
                                name="location"
                                value={formValues.location}
                                onChange={handleInputChange}
                                placeholder="e.g. Chattogram"
                                disabled={formDisabled}
                                required
                                className="h-11"
                            />
                        </div>

                        <div className="space-y-2">

                            <Label htmlFor="description">
                                Description *
                            </Label>

                            <Textarea
                                id="description"
                                name="description"
                                value={formValues.description}
                                onChange={handleInputChange}
                                placeholder="Describe the ingredients, flavors and what makes this item special..."
                                disabled={formDisabled}
                                required
                                className="min-h-40 resize-y"
                            />

                            <p className="text-xs text-muted-foreground">
                                Help customers understand what
                                makes your item unique.
                            </p>
                        </div>
                    </section>

                    <div className="space-y-6 xl:col-span-2">

                        <section className="rounded-2xl border bg-card p-5 md:p-6">

                            <ImageUploader
                                images={images}
                                onChange={setImages}
                                onUploadingChange={
                                    setIsUploading
                                }
                                disabled={formDisabled}
                            />

                        </section>

                        <section className="rounded-2xl border bg-secondary p-5">

                            <div className="flex items-start gap-3">

                                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                                    <ClipboardCheck className="size-5 text-primary" />
                                </div>

                                <div>
                                    <h3 className="font-heading font-semibold">
                                        Approval process
                                    </h3>

                                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                        Your menu item will be
                                        reviewed by an Admin
                                        before appearing on
                                        the public menu.
                                    </p>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                {formError && (
                    <div
                        role="alert"
                        className="flex items-start gap-2 rounded-xl bg-destructive/10 p-4 text-sm text-destructive"
                    >
                        <AlertCircle className="mt-0.5 size-4 shrink-0" />
                        <p>{formError}</p>
                    </div>
                )}

                <div className="flex flex-col gap-3 border-t pt-6 sm:flex-row sm:justify-end">

                    <Button
                        type="button"
                        variant="outline"
                        onClick={resetForm}
                        disabled={
                            isSubmitting || isUploading
                        }
                        className="h-11 cursor-pointer rounded-full px-6"
                    >
                        Reset form
                    </Button>

                    <Button
                        type="submit"
                        disabled={
                            formDisabled || isUploading
                        }
                        className="h-11 cursor-pointer rounded-full px-6"
                    >
                        {isSubmitting ? (
                            <LoaderCircle className="size-4 animate-spin" />
                        ) : (
                            <Send className="size-4" />
                        )}

                        {isSubmitting
                            ? "Submitting..."
                            : isUploading
                                ? "Uploading images..."
                                : "Submit for Approval"}
                    </Button>
                </div>
            </form>
        </div>
    );
}