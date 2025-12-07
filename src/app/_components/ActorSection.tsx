"use client";

import Image from "next/image";
import { getAssetUrl } from "~/utils/asset";
import { Typography } from "~/components/ui/typography";
import dayjs from "dayjs";
import { Card } from "~/components/ui/card";
import { useRouter } from "next/navigation";
import { HorizontalScroller } from "~/components/container";
import { ArtistModel } from "~/types/artist";
import { COUNTRY_DATA } from "~/constants/country";
import { cn } from "~/lib/utils";
import Link from "next/link";

export const ActorSection = ({ data }: { data: ArtistModel[] }) => {
  const router = useRouter();

  return (
    <HorizontalScroller
      items={data}
      itemWidth={260} // phù hợp với UI bạn gửi
      gap={16} // gap giữa Card
      className="mt-6"
      renderItem={(item) => {
        const country = COUNTRY_DATA.find(
          (e) => e.name.common === item.country
        );
        return (
          <Link
            key={item.id}
            href={`/artist/${item.id}`}
            className="h-full min-w-[260px] max-w-[260px] relative"
          >
            <Card className="p-0 rounded-none pb-4 border-none">
              {/* IMAGE */}
              <div className="w-full h-[380px] relative overflow-hidden group">
                <Image
                  alt={item.name}
                  fill
                  src={getAssetUrl(item.avatarUrl)}
                  className="object-cover group-hover:scale-105 transition duration-300"
                />

                {/* OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition" />
              </div>

              {/* TITLE + YEAR */}
              <div className="flex flex-col items-center">
                {country && (
                  <Image
                    alt={item.name}
                    src={country?.flags.png}
                    width={24}
                    height={24}
                    className={cn(
                      "rounded-full border border-foreground",
                      "w-6 h-6 object-cover"
                    )}
                  />
                )}
                <Typography
                  className="text-white font-light text-center mt-2"
                  variant="p"
                >
                  {dayjs(item.birthday).format("MMM DD, YYYY")}
                </Typography>
                <Typography
                  className="mt-2 text-white font-light text-center line-clamp-3"
                  variant="h4"
                >
                  {item.name}
                </Typography>
              </div>
            </Card>
          </Link>
        );
      }}
    />
  );
};
