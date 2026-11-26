"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  ArrowRight,
  LoaderCircle,
  CircleAlert,
} from "lucide-react";

import { authClient } from "../../../lib/auth-client";
import type { SocialProvider } from "../../../types/auth";

import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";

import AuthLayout from "../../../components/auth/AuthLayout";
import PasswordInput from "../../../components/auth/PasswordInput";
import SocialLogin from "../../../components/auth/SocialLogin";

interface SignInForm {
  email: string;
  password: string;
}

export default function SignInPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<SignInForm>({ email: "", password: "" });

  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [socialLoading, setSocialLoading] = useState<SocialProvider | null>(null);
  const isDisabled: boolean = isLoading || socialLoading !== null;

  const handleChange = (field: keyof SignInForm, value: string): void => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    setMessage("");
    setIsLoading(true);

    try {
      const { error } = await authClient.signIn.email({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (error) {
        setMessage(error.message || "Failed to sign in.");
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
        setMessage(error.message || "Social authentication failed.");
      }
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setSocialLoading(null);
    }
  };

  return (
    <AuthLayout
      eyebrow="Welcome to PizzaHub"
      title="Welcome back!"
      description="Sign in to discover your favorite pizzas and pick up where you left off."
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <div className="space-y-2">
          <Label htmlFor="email">
            Email address
          </Label>

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
              required
              disabled={isDisabled}
              className="h-12 rounded-xl bg-muted pl-11"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>

          <PasswordInput
            id="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            value={formData.password}
            onChange={(e) =>
              handleChange("password", e.target.value)
            }
            required
            disabled={isDisabled}
          />
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
              Signing in...
            </>
          ) : (
            <>
              Sign in
              <ArrowRight className="size-4" />
            </>
          )}
        </Button>
      </form>

      <div className="mt-7">
        <SocialLogin
          onSocialLogin={handleSocialLogin}
          loadingProvider={socialLoading}
          disabled={isDisabled}
        />
      </div>

      <p className="mt-7 text-center text-sm text-muted-foreground">
        New to PizzaHub?{" "}
        <Link
          href="/sign-up"
          className="font-semibold text-primary transition-colors hover:underline"
        >
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
}