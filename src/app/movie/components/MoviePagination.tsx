"use client";

import Link from "next/link";
import { Typography } from "~/components/ui/typography";
import { cn } from "~/lib/utils";
import { MovieQueryModel } from "~/types/movie";

export type MoviePaginationProps = {
  total: number;
  page: number;
  pageSize: number;
  queryOptions: MovieQueryModel;
};

export function MoviePagination({
  total,
  page,
  pageSize,
  queryOptions,
}: MoviePaginationProps) {
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="flex items-center justify-between gap-2 mt-8">
      <div>
        <Typography className="text-secondary" variant={"h5"}>
          Total: {total}
        </Typography>
      </div>
      <div className="flex items-center gap-2">
        {Array.from({ length: totalPages }).map((_, i) => {
          const p = i + 1;
          const active = p === page;
          return (
            <Link
              key={p}
              href={`/movie?${new URLSearchParams(
                Object.entries({
                  ...queryOptions,
                  page: p,
                }).reduce((acc, [key, value]) => {
                  acc[key] = value.toString();
                  return acc;
                }, {} as Record<string, string>)
              ).toString()}`}
              className={cn(
                "px-3 py-1 rounded border text-sm hover:bg-accent hover:text-accent-foreground",
                active && "bg-accent text-accent-foreground font-semibold"
              )}
            >
              {p}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
