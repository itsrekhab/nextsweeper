"use client";

import { cn } from "@udecode/cn";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ComponentProps } from "react";

function NavLink({
  className,
  children,
  ...props
}: ComponentProps<typeof Link>) {
  return (
    <Link
      className={cn([
        "h-full flex items-center relative data-[active=true]:pointer-events-none data-[active=true]:font-semibold px-4 py-2 -mx overflow-hidden",
        "before:transform-[translateY(-100%)] hover:before:transform-[translateY(0%)] hover:before:border-b-4 hover:before:border-blue-500 before:transition-[transform_0.1s_ease-in] hover:before:transition-[transform_0.15s_ease-in] before:absolute hover:before:bg-blue-500/25 before:size-full before:block before:inset-0 before:z-0",
        className,
      ])}
      {...props}
    >
      <span className="relative z-1">{children}</span>
    </Link>
  );
}

export default function NavLinks() {
  const pathname = usePathname();
  const t = useTranslations("Header.Nav");

  return (
    <ul className="flex list-none items-center gap h-full">
      <li className="contents">
        <NavLink href="/" data-active={pathname === "/"}>
          {t("home")}
        </NavLink>
      </li>
      <li className="contents">
        <NavLink href="/game" data-active={pathname.startsWith("/game")}>
          {t("play")}
        </NavLink>
      </li>
      <li className="contents">
        <NavLink href="/stats" data-active={pathname === "/stats"}>
          {t("stats")}
        </NavLink>
      </li>
    </ul>
  );
}
