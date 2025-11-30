"use client";

import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, EyeIcon } from "lucide-react";
import { MovieModel } from "~/types/movie";
import { getAssetUrl } from "~/utils/asset";
import { Typography } from "~/components/ui/typography";
import dayjs from "dayjs";
import { Card } from "~/components/ui/card";
import { formatNumber } from "~/utils/number";
import { useRouter } from "next/navigation";

export const MovieTrendingSection = ({ data }: { data: MovieModel[] }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const router = useRouter();

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
    <div className="relative w-full mt-6">
      {/* LEFT ARROW */}
      <button
        onClick={() => scrollByAmount(-320)}
        disabled={!canScrollLeft}
        className={`
          absolute left-0 top-1/2 -translate-y-1/2 z-20
          p-2 rounded-full bg-black/60 border border-white/10
          text-white hover:bg-black/80 transition
          ${!canScrollLeft ? "opacity-30 cursor-default" : ""}
        `}
      >
        <ChevronLeft size={28} />
      </button>

      {/* SCROLL WRAPPER */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="
          flex gap-4 overflow-x-auto no-scrollbar pr-10 pl-10
        "
      >
        {data.map((item) => (
          <Card
            key={item.id}
            className="min-w-[260px] max-w-[260px] p-0 rounded-none border-0 pb-10 relative hover:cursor-pointer"
            onClick={() => router.push(`/movie/${item.id}`)}
          >
            <div className="w-full h-[380px] relative overflow-hidden group">
              <Image
                alt={item.title}
                fill
                src={getAssetUrl(item.posterUrl)}
                className="object-cover group-hover:scale-105 transition duration-300"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition" />
            </div>

            {/* Movie title */}
            <div>
              <Typography
                className="mt-2 text-white font-light text-center line-clamp-3"
                variant={"h4"}
              >
                {item.title}
              </Typography>
              <Typography
                className="text-white font-light text-center truncate"
                variant={"h4"}
              >
                ({dayjs(item.releaseDate).format("YYYY")})
              </Typography>
            </div>
            <div className="flex flex-col items-center justify-center absolute bottom-2 left-1/2 -translate-x-1/2">
              <Typography
                className="text-white font-light text-center truncate"
                variant={"p"}
              >
                <EyeIcon className="inline" />{" "}
                <span>{formatNumber(item.view)}</span>
              </Typography>
            </div>
          </Card>
        ))}
      </div>

      {/* RIGHT ARROW */}
      <button
        onClick={() => scrollByAmount(320)}
        disabled={!canScrollRight}
        className={`
          absolute right-0 top-1/2 -translate-y-1/2 z-20
          p-2 rounded-full bg-black/60 border border-white/10
          text-white hover:bg-black/80 transition
          ${!canScrollRight ? "opacity-30 cursor-default" : ""}
        `}
      >
        <ChevronRight size={28} />
      </button>
    </div>
  );
};
