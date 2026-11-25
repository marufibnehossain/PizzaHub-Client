"use client";

import { useState } from "react";
import type { ComponentProps } from "react";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";

import { Input } from "../ui/input";

type PasswordInputProps = Omit<
  ComponentProps<typeof Input>,
  "type"
>;

export default function PasswordInput({
  className,
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] =
    useState<boolean>(false);

  return (
    <div className="relative">

      <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

      <Input
        {...props}
        type={showPassword ? "text" : "password"}
        className={`h-12 rounded-xl bg-muted pl-11 pr-12 ${
          className ?? ""
        }`}
      />

      <button
        type="button"
        disabled={props.disabled}
        aria-label={
          showPassword ? "Hide password" : "Show password"
        }
        onClick={() => setShowPassword((previous) => !previous)}
        className="absolute right-3 top-1/2 flex size-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
      >
        {showPassword ? (
          <EyeOff className="size-4" />
        ) : (
          <Eye className="size-4" />
        )}
      </button>
    </div>
  );
}