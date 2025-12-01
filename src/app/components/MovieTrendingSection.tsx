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
import { HorizontalScroller } from "~/components/container";
import Link from "next/link";

export const MovieTrendingSection = ({ data }: { data: MovieModel[] }) => {
  const router = useRouter();

  return (
    <HorizontalScroller
      items={data}
      itemWidth={260} // phù hợp với UI bạn gửi
      gap={16} // gap giữa Card
      className="mt-6"
      renderItem={(item) => (
        <Link
          key={item.id}
          href={`/movie/${item.id}`}
          className="min-w-[260px] max-w-[260px] h-full"
        >
          <Card className="p-0 h-full rounded-none border-0 pb-10 relative hover:cursor-pointer">
            {/* IMAGE */}
            <div className="w-full h-[380px] relative overflow-hidden group">
              <Image
                alt={item.title}
                fill
                src={getAssetUrl(item.posterUrl)}
                className="object-cover group-hover:scale-105 transition duration-300"
              />

              {/* OVERLAY */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition" />
            </div>

            {/* TITLE + YEAR */}
            <div>
              <Typography
                className="mt-2 text-white font-light text-center line-clamp-3"
                variant="h4"
              >
                {item.title}
              </Typography>
              <Typography
                className="text-white font-light text-center truncate"
                variant="h4"
              >
                ({dayjs(item.releaseDate).format("YYYY")})
              </Typography>
            </div>

            {/* VIEW COUNT */}
            <div className="flex flex-col items-center justify-center absolute bottom-2 left-1/2 -translate-x-1/2">
              <Typography
                className="text-white font-light text-center"
                variant="p"
              >
                <EyeIcon className="inline" />{" "}
                <span>{formatNumber(item.view)}</span>
              </Typography>
            </div>
          </Card>
        </Link>
      )}
    />
  );
};
