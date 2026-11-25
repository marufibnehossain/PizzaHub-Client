import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Pizza, MapPin } from "lucide-react";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
  eyebrow: string;
}

export default function AuthLayout({
  children,
  title,
  description,
  eyebrow,
}: AuthLayoutProps) {
  return (
    <main className="min-h-dvh bg-background p-4 lg:p-6">
      <div className="mx-auto grid min-h-[calc(100dvh-3rem)] max-w-400 lg:gap-10">

        {/* Promotional panel */}
        {/* <aside className="relative hidden overflow-hidden rounded-3xl bg-secondary p-10 lg:flex lg:flex-col xl:p-14">

          <Link
            href="/"
            className="inline-flex w-fit items-center gap-2"
          >
            <div className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Pizza className="size-6" />
            </div>

            <span className="font-heading text-3xl font-bold tracking-tight">
              pizza<span className="text-primary">hub.</span>
            </span>
          </Link>
          <div className="relative z-10 mt-16 xl:mt-20">
            <p className="font-accent text-3xl font-bold text-primary">
              A slice of happiness
            </p>

            <h2 className="mt-3 font-heading text-5xl font-semibold leading-tight tracking-tight xl:text-6xl">
              Great pizza starts here.
            </h2>

            <p className="mt-5 max-w-sm leading-relaxed text-muted-foreground">
              Discover incredible flavors from local
              kitchens and make every meal a little
              more special.
            </p>
          </div>

          <div className="relative mx-auto flex w-full items-center justify-center my-5 bg-white drop-shadow-xl">
            <Image
              src="/images/auth-pizza.jpeg"
              alt="Freshly prepared Italian pizza"
              width={650}
              height={650}
              priority
              className="relative z-10 h-auto w-full max-w-md object-contain"
            />
          </div>

          <div className="relative z-10 flex items-center gap-3 border-t border-border pt-6">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <MapPin className="size-5" />
            </div>

            <div>
              <p className="text-sm font-semibold">
                Local kitchens. Real flavors.
              </p>

              <p className="text-xs text-muted-foreground">
                Good food brings us together.
              </p>
            </div>
          </div>
        </aside> */}

        {/* Authentication section */}
        <section className="flex flex-col px-2 py-4 sm:px-8 lg:px-10">

          <div className="flex items-center justify-between">

            {/* Mobile logo */}
            <Link
              href="/"
              className="flex items-center gap-2 lg:hidden"
            >
              <Pizza className="size-7 text-primary" />

              <span className="font-heading text-2xl font-bold">
                pizza<span className="text-primary">hub.</span>
              </span>
            </Link>

            <Link
              href="/"
              className="mr-auto inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              <ArrowLeft className="size-4" />
              Back to home
            </Link>
          </div>

          {/* Form container */}
          <div className="flex flex-1 items-center justify-center py-10">
            <div className="w-full max-w-md">

              <div className="mb-8">
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
                  {eyebrow}
                </p>

                <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
                  {title}
                </h1>

                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </div>

              {children}
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} PizzaHub.
            All rights reserved.
          </p>
        </section>
      </div>
    </main>
  );
}