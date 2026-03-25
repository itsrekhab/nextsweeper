import { cn } from "@udecode/cn";
import Link from "next/link";
import { ComponentProps } from "react";

const buttonTwStyles =
  "w-fit bg-blue-700 px-3 py-1.5 text-white hover:bg-blue-800 dark:hover:bg-blue-600";

export function Button({
  children,
  className,
  ...props
}: ComponentProps<"button"> & {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button className={cn(buttonTwStyles, className)} {...props}>
      {children}
    </button>
  );
}

export function LinkButton({
  children,
  href,
  className,
  ...props
}: {
  children: React.ReactNode | undefined;
  href: string;
  className?: string;
} & ComponentProps<"a">) {
  return (
    <Link href={href} className={cn([buttonTwStyles, className])} {...props}>
      {children}
    </Link>
  );
}
