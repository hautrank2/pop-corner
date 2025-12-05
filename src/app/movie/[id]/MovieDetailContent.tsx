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
    <div className="flex min-h-screen flex-col bg-page-bg">
      <main className="flex-grow">
        <MovieHeroSection movie={movie} />
        <CommentsSection movieId={movie.id} initialComments={comments} />
      </main>
      <AppFooter />
    </div>
  );
}