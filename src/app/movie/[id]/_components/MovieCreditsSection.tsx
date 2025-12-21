"use client";

import Image from "next/image";
import { getAssetUrl } from "~/utils/asset";
import { Typography } from "~/components/ui/typography";
import { Card } from "~/components/ui/card";
import { HorizontalScroller } from "~/components/container";
import { MovieCreditModel } from "~/types/credit";
import { COUNTRY_DATA } from "~/constants/country";
import { cn } from "~/lib/utils";
import Link from "next/link";

export const MovieCreditsSection = ({ data }: { data: MovieCreditModel[] }) => {
  // Filter only credits that have artist information (actors)
  const actorCredits = data.filter((credit) => credit.artist);
  
  // Debug: log to see actual data structure
  if (process.env.NODE_ENV === "development" && actorCredits.length > 0) {
    console.log("Credit data sample:", actorCredits[0]);
  }

  return (
    <HorizontalScroller
      items={actorCredits}
      itemWidth={260}
      gap={16}
      className="mt-6"
      renderItem={(credit) => {
        if (!credit.artist) return null;

        const artist = credit.artist;
        const country = COUNTRY_DATA.find(
          (e) => e.name.common === artist.country
        );

        return (
          <Link
            key={credit.id}
            href={`/artist/${artist.id}`}
            className="h-full min-w-[260px] max-w-[260px] relative"
          >
            <Card className="p-0 rounded-none pb-4 border-none">
              {/* IMAGE */}
              <div className="w-full h-[380px] relative overflow-hidden group">
                <Image
                  alt={artist.name}
                  fill
                  src={getAssetUrl(artist.avatarUrl)}
                  className="object-cover group-hover:scale-105 transition duration-300"
                />

                {/* OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition" />
              </div>

              {/* NAME, COUNTRY, CHARACTER NAME */}
              <div className="flex flex-col items-center">
                <Typography
                  className="mt-2 text-white font-light text-center line-clamp-3"
                  variant="h4"
                >
                  {artist.name}
                </Typography>
                {country && (
                  <div className="mt-1">
                    <Image
                      alt={artist.country}
                      src={country?.flags.png}
                      width={24}
                      height={24}
                      className={cn(
                        "rounded-full border border-foreground",
                        "w-6 h-6 object-cover"
                      )}
                    />
                  </div>
                )}
                {(credit.characterName || credit.description) && (
                  <Typography
                    className="mt-1 text-text-secondary font-light text-center text-sm line-clamp-2"
                    variant="p"
                  >
                    {credit.characterName || credit.description}
                  </Typography>
                )}
              </div>
            </Card>
          </Link>
        );
      }}
    />
  );
};


