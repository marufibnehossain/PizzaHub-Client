"use client";

import { LoaderCircle } from "lucide-react";
import { FaGithub } from "react-icons/fa6";

import { Button } from "../ui/button";
import type { SocialProvider } from "../../types/auth";

interface SocialLoginProps {
  onSocialLogin: (provider: SocialProvider) => Promise<void>;
  loadingProvider: SocialProvider | null;
  disabled: boolean;
}

function GoogleIcon() {
  return (
    <svg
      viewBox="0 0 48 48"
      className="size-5"
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
  );
}

export default function SocialLogin({
  onSocialLogin,
  loadingProvider,
  disabled,
}: SocialLoginProps) {
  return (
    <div className="space-y-5">

      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-border" />

        <span className="text-xs text-muted-foreground">
          Or continue with
        </span>

        <div className="h-px flex-1 bg-border" />
      </div>

      {/* Social buttons */}
      <div className="grid grid-cols-2 gap-3">

        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          onClick={() => onSocialLogin("google")}
          className="h-12 rounded-full bg-background transition-colors hover:bg-secondary"
        >
          {loadingProvider === "google" ? (
            <LoaderCircle className="size-5 animate-spin" />
          ) : (
            <GoogleIcon />
          )}

          Google
        </Button>

        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          onClick={() => onSocialLogin("github")}
          className="h-12 rounded-full bg-background transition-colors hover:bg-secondary"
        >
          {loadingProvider === "github" ? (
            <LoaderCircle className="size-5 animate-spin" />
          ) : (
            <FaGithub className="size-5" />
          )}

          GitHub
        </Button>
      </div>
    </div>
  );
}