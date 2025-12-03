"use client";

import { MovieModel } from "~/types/movie";
import { CommentModel } from "~/types/comment";
import { MovieHeroSection } from "./components/MovieHeroSection";
import { CommentsSection } from "./components/CommentsSection";
import { AppFooter } from "~/components/layouts/footer";

interface MovieDetailContentProps {
  movie: MovieModel;
  comments: CommentModel[];
}

export function MovieDetailContent({ movie, comments }: MovieDetailContentProps) {
  return (
    <div className="min-h-screen bg-page-bg">
      <MovieHeroSection movie={movie} />
      <CommentsSection movieId={movie.id} initialComments={comments} />
      <AppFooter />
    </div>
  );
}