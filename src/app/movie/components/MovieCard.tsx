"use client";

import Image from "next/image";
import { Card, CardContent } from "~/components/ui/card";
import { Star, StarIcon } from "lucide-react";
import Link from "next/link";
import { MovieModel } from "~/types/movie";
import { cn } from "~/lib/utils";
import { Typography } from "~/components/ui/typography";
import { getAssetUrl } from "~/utils/asset";
import dayjs from "dayjs";
import { formatNumber } from "~/utils/number";

export const MovieCard = ({ data }: { data: MovieModel }) => {
  return (
    <Link key={data.id} className={cn("")} href={`/movie/${data.id}`}>
      <div
        className={cn(
          "relative overflow-hidden group shrink-0",
          "w-full h-120 md:h-120 xl:h-100"
        )}
      >
        <Image
          alt={data.title}
          fill
          src={getAssetUrl(data.posterUrl)}
          objectFit="cover"
          className="object-cover group-hover:scale-105 transition duration-300"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition" />
      </div>
      <div className="p-4 flex flex-col gap-2 overflow-y-auto no-scrollbar flex flex-col justify-between">
        <div className="flex gap-2 items-center">
          <StarIcon fill="yellow" strokeWidth={0} />
          <Typography variant="h5">{formatNumber(data.avgRating)}</Typography>
        </div>
        <Typography variant="h4" className="font-light">
          {data.title} ({dayjs(data.releaseDate).format("YYYY")})
        </Typography>

        {/* <Description
          className="mt-2"
          data={data}
          items={[
            {
              title: "Duration",
              value: `${data.duration} minutes`,
            },
            {
              title: "Director",
              value: data.director ? data.director.name : EMPTY_TEXT,
            },
            {
              title: "Views",
              value: formatNumber(data.view),
            },
          ]}
        /> */}

        {/* <Typography variant="p" className="text-sm xl:line-clamp-10">
          {data.description}
        </Typography> */}
      </div>
    </Link>
  );
};
