"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Star,
  Heart,
  Plus,
  Share2,
  MessageSquare,
  PlayCircle,
} from "lucide-react";
import { MovieModel } from "~/types/movie";
import { Button } from "~/components/ui/button";
import { Typography } from "~/components/ui/typography";
import { getAssetUrl } from "~/utils/asset";
import { formatNumber } from "~/utils/number";
import { formatDuration } from "~/utils/time";
import dayjs from "dayjs";

interface MovieHeroSectionProps {
  movie: MovieModel;
}

export function MovieHeroSection({ movie }: MovieHeroSectionProps) {
  const router = useRouter();

  const galleryImages =
    movie.imgUrls.length > 0 ? movie.imgUrls.slice(0, 6) : Array(6).fill(movie.posterUrl);

  const remainingImages = Math.max(0, movie.imgUrls.length - 6);

  return (
    <div className="px-16 py-8">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-6 gap-2 text-foreground hover:text-foreground/80"
      >
        <ArrowLeft className="h-5 w-5" />
        <span className="text-2xl font-medium">Back</span>
      </Button>

      {/* Main Content */}
      <div className="flex flex-col gap-10">

        {/* ---------- ROW 1: POSTER + NAME | VIDEO ---------- */}
        <div className="flex items-start gap-10">

          {/* Poster + Title */}
          <div className="flex-shrink-0 w-[450px] flex flex-col gap-4">

            {/* Poster */}
            <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
              <Image
                src={getAssetUrl(movie.posterUrl)}
                alt={movie.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Movie Title */}
            <Typography variant="h2" className="text-foreground font-semibold">
              {movie.title} ({dayjs(movie.releaseDate).format("YYYY")})
            </Typography>
          </div>

          {/* Video */}
          <div className="flex-1">
            <div className="relative w-full h-[450px] bg-panel-bg rounded-lg overflow-hidden group cursor-pointer">
              <Image
                src={getAssetUrl(movie.posterUrl)}
                alt={`${movie.title} trailer`}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                <PlayCircle className="h-24 w-24 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* ---------- ROW 2: INFO PANEL | GALLERY ---------- */}
        <div className="flex items-start gap-10">

          {/* Info Panel */}
          <div className="w-[450px] bg-panel-bg p-6 rounded-lg flex flex-col gap-4">

            {/* Rating */}
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 fill-star-gold text-star-gold" />
              <Typography variant="h4" className="text-foreground font-medium">
                {movie.avgRating.toFixed(1)}
              </Typography>
            </div>

            {/* Metadata */}
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <Typography className="text-foreground font-medium">Duration:</Typography>
                <Typography className="text-text-secondary font-medium">
                  {formatDuration(movie.duration)}
                </Typography>
              </div>
              <div className="flex gap-2">
                <Typography className="text-foreground font-medium">Director:</Typography>
                <Typography className="text-text-secondary font-medium">
                  {movie.director?.name || "Unknown"}
                </Typography>
              </div>
              <div className="flex gap-2">
                <Typography className="text-foreground font-medium">View:</Typography>
                <Typography className="text-text-secondary font-medium">
                  {formatNumber(movie.view)}
                </Typography>
              </div>
            </div>

            {/* Description */}
            <Typography className="text-foreground font-medium leading-relaxed">
              {movie.description}
            </Typography>

            {/* Action Buttons */}
            <div className="flex items-center gap-8 mt-2">
              <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full border-4 border-white hover:bg-white/10">
                <Heart className="h-6 w-6 text-white" />
              </Button>
              <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full border-4 border-white hover:bg-white/10">
                <Plus className="h-6 w-6 text-white" />
              </Button>
              <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full border-4 border-white hover:bg-white/10">
                <Share2 className="h-6 w-6 text-white" />
              </Button>
              <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full border-4 border-white hover:bg-white/10">
                <MessageSquare className="h-6 w-6 text-white" />
              </Button>
            </div>
          </div>

          {/* Gallery */}
          <div className="flex-1 bg-panel-bg p-4 rounded-lg">
            <div className="grid grid-cols-3 gap-0.5">
              {galleryImages.map((imgUrl, index) => (
                <div
                  key={index}
                  className="relative h-[230px] w-full overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <Image
                    src={getAssetUrl(imgUrl)}
                    alt={`${movie.title} still ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  {index === 5 && remainingImages > 0 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <Typography variant="h2" className="text-white font-medium">
                        +{remainingImages}
                      </Typography>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
