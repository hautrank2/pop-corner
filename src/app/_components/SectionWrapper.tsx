"use client";

import Link from "next/link";
import React, { ReactNode } from "react";
import { Typography } from "~/components/ui/typography";
import { cn } from "~/lib/utils";

export type SectionWrapperProps = {
  id: string;
  children: ReactNode;
  className?: string;
};
export const SectionWrapper = ({
  children,
  className,
  id,
}: SectionWrapperProps) => {
  return (
    <section
      id={id}
      className={cn(
        "section-wrapper max-w-[1754px] mx-auto px-4 md:px-16 mt-16",
        "opacity-0", // use with app.js
        className
      )}
    >
      {children}
    </section>
  );
};

export type SectionHeaderProps = {
  id: string;
  title: string;
  extra?: ReactNode;
};
export const SectionHeader = ({ id, title, extra }: SectionHeaderProps) => {
  return (
    <div className="section-header flex justify-between items-center">
      <div className="group relative w-fit overflow-hidden px-4 py-2 text-primary hover:text-foreground">
        <div
          className={cn(
            "w-1 bg-primary absolute left-0 top-0 bottom-0 z-[-1]",
            "group-hover:w-full",
            "transition-all duration-300"
          )}
        ></div>
        <Link href={`#${id}`} className="z-10">
          <Typography
            variant={"h3"}
            className={cn(
              "w-fit",
              "group-hover:scale-105 transition duration-300"
            )}
          >
            {title}
          </Typography>
        </Link>
      </div>
      {extra}
    </div>
  );
};

export type SectionContentProps = {
  children: ReactNode;
};
export const SectionContent = ({ children }: SectionContentProps) => {
  return <div className="section-content py-4">{children}</div>;
};
