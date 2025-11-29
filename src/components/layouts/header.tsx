"use client";

import React, { useEffect, useState } from "react";
import { Typography } from "~/components/ui/typography";
import { cn } from "~/lib/utils";
import Nav from "./nav";
import { useApp } from "~/providers";
import { UserAvatar } from "../user";
import Link from "next/link";

export const AppHeader = () => {
  const headerHeight = 64;
  const [headerBg, setHeaderBg] = useState(false);
  const { state } = useApp();
  const { session } = state;

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
          <Typography variant={"h3"} className="flex items-center gap-1">
            <span className="font-light">Pop corner</span>
          </Typography>
        </Link>
      </div>
      <div className="header-search px-16"></div>
      <div className="header-extra flex items-center gap-4">
        <Nav />

        {/* Model */}
        <UserAvatar />
      </div>
    </header>
  );
};
