"use client";

import { useState } from "react";
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
  ThumbsUp,
} from "lucide-react";
import { MovieModel } from "~/types/movie";
import { Button } from "~/components/ui/button";
import { Typography } from "~/components/ui/typography";
import { getAssetUrl } from "~/utils/asset";
import { formatNumber } from "~/utils/number";
import { formatDuration } from "~/utils/time";
import dayjs from "dayjs";
import { MovieReactions } from "./MovieReactions";
import { ReactionPicker } from "./ReactionPicker";

interface MovieHeroSectionProps {
  movie: MovieModel;
}

export function MovieHeroSection({ movie }: MovieHeroSectionProps) {
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [reactionKey, setReactionKey] = useState(0);

  const galleryImages =
    movie.imgUrls.length > 0
      ? movie.imgUrls.slice(0, 6)
      : Array(6).fill(movie.posterUrl);

  const remainingImages = Math.max(0, movie.imgUrls.length - 6);

  const getYouTubeEmbedUrl = (url: string | undefined) => {
    if (!url) return null;
    // Trích xuất video ID từ các định dạng URL YouTube khác nhau
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = match && match[2].length === 11 ? match[2] : null;
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : null;
  };

  return (
    <div className="px-4 md:px-10 lg:px-16 py-8">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-6 gap-2 text-foreground hover:text-foreground/80"
      >
        <ArrowLeft className="h-5 w-5" />
        <span className="text-2xl font-medium">Back</span>
      </Button>

      {/* MAIN WRAPPER */}
      <div className="flex flex-col gap-4">
        {/* ==============================
            ROW 1: POSTER + VIDEO
        =============================== */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* POSTER */}
          <div className="relative lg:w-1/4 w-full aspect-[2/3] rounded-lg overflow-hidden">
            <Image
              src={getAssetUrl(movie.posterUrl)}
              alt={movie.title}
              fill
              className="object-cover"
              priority
            />

            {/* Title Overlay */}
            <div className="absolute bottom-0 left-0 w-full bg-black/60 px-4 py-3 bg-gradient-to-r from-black to-black">
              <Typography
                variant="h2"
                className="text-neon-pink font-semibold leading-tight"
              >
                {movie.title} ({dayjs(movie.releaseDate).format("YYYY")})
              </Typography>
            </div>
          </div>

          {/* VIDEO */}
          <div className="flex-1 relative aspect-video bg-panel-bg rounded-lg overflow-hidden">
            {isPlaying && getYouTubeEmbedUrl(movie.trailerUrl) ? (
              <iframe
                src={getYouTubeEmbedUrl(movie.trailerUrl)!}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            ) : (
              <div
                className="w-full h-full group cursor-pointer"
                onClick={() => setIsPlaying(true)}
              >
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
            )}
          </div>
        </div>

        {/* ==============================
            ROW 2: INFO PANEL + GALLERY
        =============================== */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* INFO PANEL */}
          <div className="lg:w-1/4 w-full bg-panel-bg p-6 rounded-lg flex flex-col gap-4">
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
                <Typography className="text-foreground font-medium">
                  Duration:
                </Typography>
                <Typography className="text-text-secondary font-medium">
                  {formatDuration(movie.duration)}
                </Typography>
              </div>

              <div className="flex gap-2">
                <Typography className="text-foreground font-medium">
                  Director:
                </Typography>
                <Typography className="text-text-secondary font-medium">
                  {movie.director?.name || "Unknown"}
                </Typography>
              </div>

              <div className="flex gap-2">
                <Typography className="text-foreground font-medium">
                  View:
                </Typography>
                <Typography className="text-text-secondary font-medium">
                  {formatNumber(movie.view)}
                </Typography>
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col">
              <Typography
                className={`text-foreground font-medium leading-relaxed ${
                  !isDescriptionExpanded ? "line-clamp-3" : ""
                }`}
              >
                {movie.description}
              </Typography>
              <Button
                variant="link"
                className="p-0 h-auto text-neon-pink hover:text-neon-pink/80 self-start text-sm"
                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              >
                {isDescriptionExpanded ? "Thu gọn" : "Xem thêm"}
              </Button>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-wrap items-center gap-8 mt-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12 rounded-full border-4 border-white hover:bg-white/10"
              >
                <Heart className="h-6 w-6 text-white" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12 rounded-full border-4 border-white hover:bg-white/10"
              >
                <Plus className="h-6 w-6 text-white" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12 rounded-full border-4 border-white hover:bg-white/10"
              >
                <Share2 className="h-6 w-6 text-white" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12 rounded-full border-4 border-white hover:bg-white/10"
              >
                <MessageSquare className="h-6 w-6 text-white" />
              </Button>
              <ReactionPicker
                movieId={movie.id}
                onReactionSelected={() => {
                  // Refresh reactions when a new reaction is posted
                  setReactionKey((prev) => prev + 1);
                }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-12 w-12 rounded-full border-4 border-white hover:bg-white/10"
                >
                  <ThumbsUp className="h-6 w-6 text-white" />
                </Button>
              </ReactionPicker>
            </div>

            {/* REACTIONS */}
            <MovieReactions key={reactionKey} movieId={movie.id} />
          </div>

          {/* IMAGE GALLERY */}
          <div className="flex-1 bg-panel-bg p-4 rounded-lg">
            <div className="grid grid-cols-3 gap-0.5">
              {galleryImages.map((imgUrl, index) => (
                <div
                  key={index}
                  className="relative aspect-video overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <Image
                    src={getAssetUrl(imgUrl)}
                    alt={`${movie.title} still ${index + 1}`}
                    fill
                    className="object-cover"
                  />

                  {index === 5 && remainingImages > 0 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <Typography
                        variant="h2"
                        className="text-white font-medium"
                      >
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
