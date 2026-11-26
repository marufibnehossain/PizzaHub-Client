"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserRound, Mail, ShoppingBag, Store, ArrowRight, LoaderCircle, CircleAlert } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { authClient } from "../../../lib/auth-client";
import type { RegistrationRole, SocialProvider } from "../../../types/auth";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../../../components/ui/radio-group";
import AuthLayout from "../../../components/auth/AuthLayout";
import PasswordInput from "../../../components/auth/PasswordInput";
import SocialLogin from "../../../components/auth/SocialLogin";

interface SignUpForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface RoleOption {
  value: RegistrationRole;
  label: string;
  description: string;
  icon: LucideIcon;
}

const roleOptions: RoleOption[] = [
  {
    value: "customer",
    label: "Customer",
    description:
      "Discover local flavors and order delicious pizza.",
    icon: ShoppingBag,
  },
  {
    value: "vendor",
    label: "Vendor",
    description:
      "Grow your business and reach more customers.",
    icon: Store,
  },
];

export default function SignUpPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<SignUpForm>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [role, setRole] = useState<RegistrationRole>("customer");
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [socialLoading, setSocialLoading] = useState<SocialProvider | null>(null);
  const isDisabled: boolean = isLoading || socialLoading !== null;

  const handleChange = (field: keyof SignUpForm, value: string): void => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setMessage("");

    if (!formData.name.trim()) {
      setMessage("Please enter your full name.");
      return;
    }

    if (formData.password.length < 8) {
      setMessage(
        "Password must be at least 8 characters."
      );
      return;
    }

    if (
      formData.password !== formData.confirmPassword
    ) {
      setMessage("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await authClient.signUp.email({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,

        fetchOptions: {
          body: {
            registrationRole: role,
          },
        },
      });

      if (error) {
        setMessage(
          error.message || "Failed to create account."
        );
        return;
      }

      router.replace("/dashboard");
    } catch {
      setMessage(
        "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: SocialProvider): Promise<void> => {
    setMessage("");
    setSocialLoading(provider);

    try {
      const { error } = await authClient.signIn.social({
        provider,
        callbackURL: "/dashboard",
      });

      if (error) {
        setMessage(
          error.message || "Social authentication failed."
        );
      }
    } catch {
      setMessage(
        "Something went wrong. Please try again."
      );
    } finally {
      setSocialLoading(null);
    }
  };

  return (
    <AuthLayout
      eyebrow="Join the PizzaHub community"
      title="Create your account."
      description="Good food and great opportunities are waiting for you."
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>

          <div className="relative">
            <UserRound className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              autoComplete="name"
              value={formData.name}
              onChange={(e) =>
                handleChange("name", e.target.value)
              }
              disabled={isDisabled}
              required
              className="h-12 rounded-xl bg-muted pl-11"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>

          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={formData.email}
              onChange={(e) =>
                handleChange("email", e.target.value)
              }
              disabled={isDisabled}
              required
              className="h-12 rounded-xl bg-muted pl-11"
            />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">

          <div className="space-y-2">
            <Label htmlFor="password">
              Password
            </Label>

            <PasswordInput
              id="password"
              placeholder="Min. 8 characters"
              autoComplete="new-password"
              value={formData.password}
              onChange={(e) =>
                handleChange("password", e.target.value)
              }
              minLength={8}
              disabled={isDisabled}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">
              Confirm password
            </Label>

            <PasswordInput
              id="confirmPassword"
              placeholder="Repeat password"
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={(e) =>
                handleChange(
                  "confirmPassword",
                  e.target.value
                )
              }
              disabled={isDisabled}
              required
            />
          </div>
        </div>
        <div className="space-y-3">
          <Label id="registration-role-label">
            How would you like to join?
          </Label>

          <RadioGroup
            aria-labelledby="registration-role-label"
            value={role}
            disabled={isDisabled}
            onValueChange={(value: string) => {
              if (
                value === "customer" ||
                value === "vendor"
              ) {
                setRole(value);
              }
            }}
            className="grid grid-cols-2 gap-3"
          >
            {roleOptions.map((option) => {
              const Icon = option.icon;

              return (
                <Label
                  key={option.value}
                  htmlFor={`role-${option.value}`}
                  className={`flex h-full cursor-pointer flex-col items-start gap-3 rounded-2xl border p-4 transition-all duration-200 ${
                    role === option.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50 hover:bg-muted"
                  } ${
                    isDisabled
                      ? "pointer-events-none opacity-60"
                      : ""
                  }`}
                >
                  <div className="flex w-full items-center justify-between">

                    <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </div>

                    <RadioGroupItem
                      value={option.value}
                      id={`role-${option.value}`}
                    />
                  </div>

                  <div className="space-y-1">
                    <p className="font-heading text-base font-semibold">
                      {option.label}
                    </p>

                    <p className="text-xs font-normal leading-relaxed text-muted-foreground">
                      {option.description}
                    </p>
                  </div>
                </Label>
              );
            })}
          </RadioGroup>
        </div>
        {message && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive"
          >
            <CircleAlert className="mt-0.5 size-4 shrink-0" />
            <p>{message}</p>
          </div>
        )}
        <Button
          type="submit"
          disabled={isDisabled}
          className="h-12 w-full rounded-full font-semibold transition-colors cursor-pointer"
        >
          {isLoading ? (
            <>
              <LoaderCircle className="size-5 animate-spin" />
              Creating account...
            </>
          ) : (
            <>
              Create account
              <ArrowRight className="size-4" />
            </>
          )}
        </Button>
      </form>
      <div className="mt-6">
        <SocialLogin
          onSocialLogin={handleSocialLogin}
          loadingProvider={socialLoading}
          disabled={isDisabled}
        />
        <p className="mt-3 text-center text-xs leading-relaxed text-muted-foreground">
          New accounts created with Google or GitHub
          are registered as customers.
        </p>
      </div>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="font-semibold text-primary transition-colors hover:underline"
        >
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}