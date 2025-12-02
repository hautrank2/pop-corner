import React, { ReactNode } from "react";
import { Typography } from "~/components/ui/typography";
import { cn } from "~/lib/utils";

export type SectionWrapperProps = {
  children: ReactNode;
  className?: string;
};
export const SectionWrapper = ({
  children,
  className,
}: SectionWrapperProps) => {
  return (
    <section
      className={cn(
        "section-wrapper max-w-[1754px] mx-auto px-4 md:px-16 mt-16",
        className
      )}
    >
      {children}
    </section>
  );
};

export type SectionHeaderProps = {
  title: string;
};
export const SectionHeader = ({ title }: SectionHeaderProps) => {
  return (
    <div className="section-header">
      <Typography
        variant={"h3"}
        className="text-primary w-fit min-w-[400px] border-b-2 border-primary pb-2"
      >
        {title}
      </Typography>
    </div>
  );
};

export type SectionContentProps = {
  children: ReactNode;
};
export const SectionContent = ({ children }: SectionContentProps) => {
  return <div className="section-content py-4">{children}</div>;
};
