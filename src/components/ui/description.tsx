"use client";

import { forwardRef } from "react";
import { cn } from "~/lib/utils";
import { Typography } from "~/components/ui/typography";
import { EMPTY_TEXT } from "~/constants/app";

export type DescriptionLayout = "horizontal" | "vertical";

export type DescriptionItemType<T = any> = {
  key?: string;
  title: string;

  /** Optional: custom value override (không dùng function) */
  value?: any;

  /** Custom class for this specific item block */
  className?: string;
  style?: React.CSSProperties;

  /** Custom class for title (dt) */
  titleClassName?: string;
  titleStyle?: React.CSSProperties;

  /** Custom class for value (dd) */
  valueClassName?: string;
  valueStyle?: React.CSSProperties;
};

export type DescriptionProps<T = any> =
  React.HTMLAttributes<HTMLDListElement> & {
    items: DescriptionItemType<T>[];
    data: T;
    emptyText?: string;

    layout?: DescriptionLayout;
    labelWidth?: string;
    columnGap?: string;
    rowGap?: string;

    titleClassName?: string;
    titleStyle?: React.CSSProperties;

    valueClassName?: string;
    valueStyle?: React.CSSProperties;
  };

export const Description = forwardRef<HTMLDListElement, DescriptionProps<any>>(
  (
    {
      className,
      style,
      items,
      data,
      emptyText = EMPTY_TEXT,
      layout = "horizontal",
      labelWidth = "max-content",
      columnGap = "gap-x-4",
      rowGap = "gap-y-2",

      titleClassName,
      titleStyle,
      valueClassName,
      valueStyle,

      ...props
    },
    ref
  ) => {
    return (
      <dl
        ref={ref}
        className={cn(
          "grid",
          layout === "horizontal"
            ? "grid-cols-[var(--label-width)_1fr]"
            : "grid-cols-1",
          columnGap,
          rowGap,
          "items-start",
          "max-sm:grid-cols-1",
          className
        )}
        style={{ ["--label-width" as any]: labelWidth, ...style }}
        {...props}
      >
        {items.map((item) => {
          const value = item.value ?? emptyText;

          return (
            <DescriptionItem
              key={item.key ?? item.title}
              title={item.title}
              value={value}
              emptyText={emptyText}
              className={item.className}
              style={item.style}
              titleClassName={cn(titleClassName, item.titleClassName)}
              valueClassName={cn(valueClassName, item.valueClassName)}
              titleStyle={{ ...titleStyle, ...item.titleStyle }}
              valueStyle={{ ...valueStyle, ...item.valueStyle }}
            />
          );
        })}
      </dl>
    );
  }
);

Description.displayName = "Description";

export type DescriptionItemProps = {
  title: string;
  value: any;
  emptyText?: string;

  className?: string;
  style?: React.CSSProperties;

  titleClassName?: string;
  titleStyle?: React.CSSProperties;

  valueClassName?: string;
  valueStyle?: React.CSSProperties;
};

export const DescriptionItem = ({
  title,
  value,
  emptyText = EMPTY_TEXT,

  className,
  style,

  titleClassName,
  titleStyle,

  valueClassName,
  valueStyle,
}: DescriptionItemProps) => {
  const displayValue = value ?? emptyText;

  return (
    <div className={cn("contents", className)} style={style}>
      <Typography
        variant="p"
        className={cn(
          "whitespace-nowrap text-sm font-medium max-sm:font-semibold",
          titleClassName
        )}
        style={titleStyle}
      >
        {title}:
      </Typography>

      <Typography
        className={cn(
          "text-sm break-words",
          typeof displayValue === "string" &&
            displayValue.startsWith("http") &&
            "font-mono",
          valueClassName
        )}
        style={valueStyle}
      >
        {displayValue}
      </Typography>
    </div>
  );
};

DescriptionItem.displayName = "DescriptionItem";
