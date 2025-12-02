import dayjs from "dayjs";
import { StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Card } from "~/components/ui/card";
import { Description } from "~/components/ui/description";
import { Typography } from "~/components/ui/typography";
import { EMPTY_TEXT } from "~/constants/app";
import { cn } from "~/lib/utils";
import { MovieModel } from "~/types/movie";
import { getAssetUrl } from "~/utils/asset";
import { formatNumber } from "~/utils/number";

export type MovieTopRatedSectionProps = {
  data: MovieModel[];
};

export const MovieTopRatedSection = ({ data }: MovieTopRatedSectionProps) => {
  return (
    <section className="movie-top-rated-section">
      <div
        className={cn(
          "md:grid md:grid-cols-12 md:gap-8 pt-4",
          "flex gap-4 overflow-x-auto no-scrollbar"
        )}
      >
        {data.map((item, index) => {
          return (
            <Link
              key={item.id}
              className={cn(
                "movie-item p-0 rounded-none bg-card border-0 hover:cursor-pointer mr-5",
                "relative flex md:flex-row flex-col justify-start",
                "h-[780px] md:h-[372px] 2xl:col-span-4 xl:col-span-6 col-span-12",
                "min-w-[320px] sm:min-w-[520px] md:w-auto",
                "2xl:h-[564px] 2xl:col-span-6"
              )}
              href={`/movie/${item.id}`}
            >
              <Typography
                variant={"p"}
                className="p-2 bg-primary absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 z-10"
              >
                #{index + 1}
              </Typography>
              <div
                className={cn(
                  "relative overflow-hidden group shrink-0",
                  "w-full md:w-[248px] h-[400px] sm:h-[640px] md:h-full",
                  "2xl:w-[372px]"
                )}
              >
                <Image
                  alt={item.title}
                  fill
                  src={getAssetUrl(item.posterUrl)}
                  className="object-cover group-hover:scale-105 transition duration-300"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition" />
              </div>
              <div className="p-4 flex flex-col gap-2 overflow-y-auto no-scrollbar">
                <Typography variant="h4" className="font-light">
                  {item.title} ({dayjs(item.releaseDate).format("YYYY")})
                </Typography>
                <div className="flex gap-2 items-center">
                  <StarIcon fill="yellow" strokeWidth={0} />
                  <Typography variant="h5">
                    {formatNumber(item.avgRating)}
                  </Typography>
                </div>
                <Description
                  className="mt-2"
                  data={item}
                  items={[
                    {
                      title: "Duration",
                      value: `${item.duration} minutes`,
                    },
                    {
                      title: "Director",
                      value: item.director ? item.director.name : EMPTY_TEXT,
                    },
                    {
                      title: "Views",
                      value: formatNumber(item.view),
                    },
                  ]}
                />

                <Typography variant="p" className="text-sm xl:line-clamp-10">
                  {item.description}
                </Typography>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};
