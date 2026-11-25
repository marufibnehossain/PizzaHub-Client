"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "../../../lib/auth-client";

import { Button } from "../../../components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";

export default function SignInPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleEmailSignIn = async (e: React.FormEvent) => {
        e.preventDefault();

        setMessage("");
        setLoading(true);

        const { error } = await authClient.signIn.email({
            email,
            password,
            callbackURL: "/",
        });

        setLoading(false);

        if (error) {
            setMessage(error.message || "Invalid email or password.");
            return;
        }
    };

    const handleSocialSignIn = async (
        provider: "google" | "github"
    ) => {
        setMessage("");

        const { error } = await authClient.signIn.social({
            provider,
            callbackURL: "/",
        });

        if (error) {
            setMessage(error.message || "Authentication failed.");
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center px-4 py-12">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">
                        Welcome back
                    </CardTitle>

                    <CardDescription>
                        Sign in to continue to PizzaHub
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">

                    <div className="grid grid-cols-2 gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleSocialSignIn("google")}
                        >
                            Google
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleSocialSignIn("github")}
                        >
                            GitHub
                        </Button>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>

                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                Or continue with email
                            </span>
                        </div>
                    </div>

                    <form
                        onSubmit={handleEmailSignIn}
                        className="space-y-4"
                    >
                        <div className="space-y-2">
                            <Label htmlFor="email">
                                Email
                            </Label>

                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">
                                Password
                            </Label>

                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                required
                            />
                        </div>

                        {message && (
                            <p className="text-sm text-destructive">
                                {message}
                            </p>
                        )}

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </Button>
                    </form>

                    <p className="text-center text-sm text-muted-foreground">
                        Don&apos;t have an account?{" "}
                        <Link
                            href="/sign-up"
                            className="font-medium text-foreground underline underline-offset-4"
                        >
                            Sign up
                        </Link>
                    </p>

                </CardContent>
            </Card>
        </main>
    );
}