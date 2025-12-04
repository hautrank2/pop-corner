"use client";

import Image from "next/image";
import { Card, CardContent } from "~/components/ui/card";
import { Star } from "lucide-react";
import Link from "next/link";
import { MovieModel } from "~/types/movie";

export const MovieCard = ({ movie }: { movie: MovieModel }) => {
  return (
    <Link href={`/movie/${movie.id}`}>
      <Card className="overflow-hidden hover:shadow-md transition-shadow">
        <div className="relative w-full h-64">
          <Image
            src={movie.posterUrl}
            alt={movie.title}
            fill
            className="object-cover"
          />
        </div>

        <CardContent className="p-4 space-y-2">
          <h3 className="font-semibold line-clamp-2">{movie.title}</h3>

          <div className="flex items-center text-sm text-muted-foreground">
            <Star className="h-4 w-4 text-yellow-500 mr-1" />
            {movie.avgRating?.toFixed(1) || "0.0"}
          </div>

          <p className="line-clamp-3 text-sm text-muted-foreground">
            {movie.description}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
};
