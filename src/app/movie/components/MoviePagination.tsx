"use client";

import Link from "next/link";
import { cn } from "~/lib/utils";

export function MoviePagination({
  total,
  page,
  pageSize,
}: {
  total: number;
  page: number;
  pageSize: number;
}) {
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {Array.from({ length: totalPages }).map((_, i) => {
        const p = i + 1;
        const active = p === page;
        return (
          <Link
            key={p}
            href={`/movie?page=${p}`}
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
  );
}
