import Link from "next/link";
import { Pizza } from "lucide-react";

interface LogoProps {
    href?: string;
    className?: string;
}

export default function Logo({ href = "/", className = "" }: LogoProps) {
    return (
        <Link
            href={href}
            className={`inline-flex w-fit items-center gap-2 ${className}`}
        >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Pizza className="size-6" />
            </div>

            <span className="font-heading text-2xl font-bold tracking-tight">
                pizza<span className="text-primary">hub.</span>
            </span>
        </Link>
    );
}