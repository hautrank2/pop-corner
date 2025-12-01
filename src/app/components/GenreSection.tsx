"use client";

import { Card } from "~/components/ui/card";
import { useRouter } from "next/navigation";
import { GenreModel } from "~/types/genre";
import { GENRES_DATA } from "~/constants/genre";
import { Typography } from "~/components/ui/typography";
import { HorizontalScroller } from "~/components/container";
import { useState } from "react";

export type GenreSectionProps = {
  data: GenreModel[];
};

export const GenreSection = ({ data }: GenreSectionProps) => {
  return (
    <HorizontalScroller
      items={data}
      itemWidth={260}
      className="relative w-full mt-6"
      renderItem={(item) => {
        return <GenreCard key={item.id} item={item} />;
      }}
    />
  );
};

export const GenreCard = ({ item }: { item: GenreModel }) => {
  const genre = GENRES_DATA.find((e) => e.id === item.id)!;
  const Icon = genre.icon;
  const router = useRouter();
  const [hover, setHover] = useState(false);

  return (
    <Card
      className="rounded-none border-0 hover:cursor-pointer text-center flex flex-col items-center gap-2 py-4"
      onClick={() =>
        router.push(
          `/movie?${new URLSearchParams({
            genre: item.id.toString(),
          }).toString()}`
        )
      }
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* ICON WRAPPER – giữ chiều cao cố định */}
      <div
        className="
          flex items-center justify-center 
          h-[60px] w-[60px]
        "
      >
        <Icon
          color="var(--secondary)"
          size={hover ? 54 : 40}
          className="transition-all duration-300 ease-out"
          style={{
            transform: hover ? "scale(1.15)" : "scale(1)",
          }}
        />
      </div>

      {/* TEXT */}
      <Typography
        variant="h5"
        className="transition-opacity duration-300"
        style={{ opacity: hover ? 0.85 : 1 }}
      >
        {item.name}
      </Typography>
    </Card>
  );
};
