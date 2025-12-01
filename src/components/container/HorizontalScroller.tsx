"use client";

import { useRef, useState, useEffect, ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "~/lib/utils";

export type HorizontalScrollerProps<T> = {
  items: T[];
  itemWidth?: number;
  gap?: number;
  className?: string;
  renderItem: (item: T) => ReactNode;
};

export function HorizontalScroller<T>({
  items,
  renderItem,
  itemWidth = 260,
  gap = 16,
  className,
}: HorizontalScrollerProps<T>) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth);
  };

  useEffect(() => {
    checkScroll();
  }, []);

  const scrollByAmount = (amount: number) => {
    const el = scrollRef.current;
    if (!el) return;

    el.scrollBy({
      left: amount,
      behavior: "smooth",
    });
  };

  return (
    <div className={cn("relative w-full", className)}>
      {/* LEFT BUTTON */}
      <button
        onClick={() => scrollByAmount(-(itemWidth + gap) * 1.2)}
        disabled={!canScrollLeft}
        className={cn(
          "absolute left-0 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full",
          "bg-black/60 border border-white/10 text-white hover:bg-black/80 transition",
          !canScrollLeft && "opacity-30 cursor-default"
        )}
      >
        <ChevronLeft size={28} />
      </button>

      {/* CONTENT */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className={cn(
          "flex overflow-x-auto no-scrollbar px-10",
          `gap-[${gap}px]`
        )}
        style={{ gap }}
      >
        {items.map((item, i) => (
          <div key={i} style={{ minWidth: itemWidth, maxWidth: itemWidth }}>
            {renderItem(item)}
          </div>
        ))}
      </div>

      {/* RIGHT BUTTON */}
      <button
        onClick={() => scrollByAmount((itemWidth + gap) * 1.2)}
        disabled={!canScrollRight}
        className={cn(
          "absolute right-0 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full",
          "bg-black/60 border border-white/10 text-white hover:bg-black/80 transition",
          !canScrollRight && "opacity-30 cursor-default"
        )}
      >
        <ChevronRight size={28} />
      </button>
    </div>
  );
}
