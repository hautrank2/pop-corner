"use client";

import React, { useEffect, useState } from "react";
import { Typography } from "~/components/ui/typography";
import { cn } from "~/lib/utils";
import Nav from "./nav";
import { UserAvatar } from "../user";
import Link from "next/link";

export const AppHeader = () => {
  const headerHeight = 64;
  const [headerBg, setHeaderBg] = useState(false);

  useEffect(() => {
    const trackingScroll = () => {
      if (window.scrollY > headerHeight + 20) {
        setHeaderBg(true);
      } else {
        setHeaderBg(false);
      }
    };

    trackingScroll();
    window.addEventListener("scroll", trackingScroll);

    return () => {
      window.removeEventListener("scroll", trackingScroll);
    };
  }, []);

  return (
    <header
      className={cn(
        "flex justify-between items-center w-full sticky top-0 h-[var(--header-height)] px-16 border-b z-20",
        "transition-colors easy duration-500",
        headerBg ? "bg-background/90" : ""
      )}
    >
      <div className="header-branch">
        <Link href={"/"}>
          <Typography
            variant={"h3"}
            className={cn(
              "flex items-center gap-1",
              "text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]"
            )}
          >
            Pop corner
          </Typography>
        </Link>
      </div>
      <div className="header-search px-16"></div>
      <div className="header-extra flex items-center gap-4">
        <Nav />
        <UserAvatar />
      </div>
    </header>
  );
};
