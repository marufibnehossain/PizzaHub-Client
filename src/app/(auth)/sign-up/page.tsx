"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag, Store, Loader2 } from "lucide-react";

import { authClient } from "../../../lib/auth-client";

import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";

import {
  RadioGroup,
  RadioGroupItem,
} from "../../../components/ui/radio-group";

export default function SignUpPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [role, setRole] = useState<"customer" | "vendor">(
    "customer"
  );

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [socialLoading, setSocialLoading] = useState<
    "google" | "github" | null
  >(null);

  // Email/password registration
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setMessage("");

    if (password.length < 8) {
      setMessage("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,

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

      router.push("/test-auth");
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Google and GitHub authentication
  const handleSocialSignIn = async (
    provider: "google" | "github"
  ) => {
    setMessage("");
    setSocialLoading(provider);

    try {
      const { error } = await authClient.signIn.social({
        provider,
        callbackURL: "/test-auth",
      });

      if (error) {
        setMessage(
          error.message || "Social authentication failed."
        );
      }
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setSocialLoading(null);
    }
  };

  const isDisabled = isLoading || socialLoading !== null;

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-lg">

        <CardHeader className="space-y-2 text-center">
          <Link
            href="/"
            className="mb-2 text-3xl font-bold text-primary"
          >
            PizzaHub
          </Link>

          <CardTitle className="text-2xl font-bold">
            Create your account
          </CardTitle>

          <CardDescription>
            Join PizzaHub and discover a world of great pizza.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">

          {/* Registration form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Full name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>

              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                disabled={isDisabled}
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>

              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                disabled={isDisabled}
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>

              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                minLength={8}
                disabled={isDisabled}
                required
              />

              <p className="text-xs text-muted-foreground">
                Password must contain at least 8 characters.
              </p>
            </div>

            {/* Confirm password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                Confirm Password
              </Label>

              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                autoComplete="new-password"
                disabled={isDisabled}
                required
              />
            </div>

            {/* Role selection */}
            <div className="space-y-3">
              <Label id="role-label">Register as</Label>

              <RadioGroup
                aria-labelledby="role-label"
                value={role}
                disabled={isDisabled}
                onValueChange={(value) => {
                  if (
                    value === "customer" ||
                    value === "vendor"
                  ) {
                    setRole(value);
                  }
                }}
                className="grid grid-cols-2 gap-3"
              >

                {/* Customer */}
                <Label
                  htmlFor="customer"
                  className={`flex cursor-pointer flex-col
                    items-start gap-3 rounded-lg border p-4
                    transition-colors ${
                      role === "customer"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                >
                  <div className="flex w-full items-center justify-between">
                    <ShoppingBag className="size-5 text-primary" />

                    <RadioGroupItem
                      value="customer"
                      id="customer"
                    />
                  </div>

                  <span className="font-semibold">
                    Customer
                  </span>

                  <span className="text-xs leading-relaxed text-muted-foreground">
                    Discover and order your favorite pizzas.
                  </span>
                </Label>

                {/* Vendor */}
                <Label
                  htmlFor="vendor"
                  className={`flex cursor-pointer flex-col
                    items-start gap-3 rounded-lg border p-4
                    transition-colors ${
                      role === "vendor"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                >
                  <div className="flex w-full items-center justify-between">
                    <Store className="size-5 text-primary" />

                    <RadioGroupItem
                      value="vendor"
                      id="vendor"
                    />
                  </div>

                  <span className="font-semibold">
                    Vendor
                  </span>

                  <span className="text-xs leading-relaxed text-muted-foreground">
                    Sell pizzas and manage your restaurant.
                  </span>
                </Label>

              </RadioGroup>
            </div>

            {/* Registration error */}
            {message && (
              <p
                role="alert"
                className="rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive"
              >
                {message}
              </p>
            )}

            {/* Submit button */}
            <Button
              type="submit"
              className="w-full"
              disabled={isDisabled}
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>

          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>

            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-3 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          {/* Social authentication */}
          <div className="grid grid-cols-2 gap-3">

            {/* Google */}
            <Button
              type="button"
              variant="outline"
              disabled={isDisabled}
              onClick={() => handleSocialSignIn("google")}
            >
              {socialLoading === "google" ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <svg
                  viewBox="0 0 48 48"
                  className="size-4"
                  aria-hidden="true"
                >
                  <path
                    fill="#4285F4"
                    d="M43.61 24.46c0-1.36-.12-2.66-.35-3.92H24v7.42h11a9.4 9.4 0 0 1-4.08 6.17v5.13h6.61c3.87-3.56 6.08-8.8 6.08-14.8z"
                  />
                  <path
                    fill="#34A853"
                    d="M24 44c5.51 0 10.13-1.83 13.51-4.74l-6.61-5.13c-1.83 1.23-4.17 1.96-6.9 1.96-5.32 0-9.82-3.59-11.43-8.41H5.76v5.28A20 20 0 0 0 24 44z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M12.57 27.68A12 12 0 0 1 12 24c0-1.28.21-2.53.57-3.68v-5.28H5.76A20 20 0 0 0 4 24c0 3.23.78 6.29 2.16 8.96l6.41-5.28z"
                  />
                  <path
                    fill="#EA4335"
                    d="M24 11.91c3 0 5.68 1.03 7.8 3.05l5.85-5.85C34.12 5.83 29.51 4 24 4A20 20 0 0 0 5.76 15.04l6.81 5.28C14.18 15.5 18.68 11.91 24 11.91z"
                  />
                </svg>
              )}

              Google
            </Button>

            {/* GitHub */}
            <Button
              type="button"
              variant="outline"
              disabled={isDisabled}
              onClick={() => handleSocialSignIn("github")}
            >
              {socialLoading === "github" ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                // <Github className="size-4" />
                <p>github</p>
              )}

              GitHub
            </Button>

          </div>

          <p className="text-center text-xs text-muted-foreground">
            New accounts created with Google or GitHub are
            registered as customers.
          </p>

          {/* Sign-in link */}
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="font-semibold text-primary hover:underline"
            >
              Sign In
            </Link>
          </p>

        </CardContent>
      </Card>
    </main>
  );
}