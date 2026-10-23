"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTransition, type ReactNode } from "react";
import { LinearProgress } from "@mui/material";

export default function NavigationLink({ href, children }: { href: string; children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();
  return <>
    <Link href={href} aria-current={pathname === href ? "page" : undefined} aria-busy={pending}
      style={{ display: "block", borderRadius: 8, margin: "3px 8px", overflow: "hidden", background: pending ? "#eef5ff" : undefined }}
      onClick={event => {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
        event.preventDefault();
        if (pathname !== href) startTransition(() => router.push(href));
      }}>
      {children}
    </Link>
    {pending && <LinearProgress aria-label="Хуудас шилжиж байна" sx={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1500, height: 3 }} />}
  </>;
}
