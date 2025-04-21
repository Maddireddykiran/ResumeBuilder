"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import logoSrc from "public/logo.svg";
import { cx } from "lib/cx";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export const TopNavBar = () => {
  const pathName = usePathname();
  const isHomePage = pathName === "/";
  const isResumeBuilder = pathName === "/resume-builder";

  return (
    <header
      aria-label="Site Header"
      className={cx(
        "flex h-[var(--top-nav-bar-height)] items-center border-b-2 border-gray-100 px-3 lg:px-12",
        isHomePage && "bg-dot"
      )}
    >
      <div className="flex h-10 w-full items-center justify-between">
        <div className="flex items-center">
          {isResumeBuilder && (
            <Link href="/" className="mr-4 flex items-center text-gray-700 hover:text-gray-900">
              <ArrowLeftIcon className="h-5 w-5 mr-1" />
              <span>Back</span>
            </Link>
          )}
          <Link href="/">
            <span className="sr-only">MKR</span>
            <Image
              src={logoSrc}
              alt="MKR Logo"
              className="h-8 w-full"
              priority
            />
          </Link>
        </div>
        <nav
          aria-label="Site Nav Bar"
          className="flex items-center gap-2 text-sm font-medium"
        >
          {/* Navigation links removed */}
        </nav>
      </div>
    </header>
  );
};
