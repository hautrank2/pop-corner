"use client";

import { MovieModel } from "~/types/movie";
import { CommentModel } from "~/types/comment";
import { MovieCreditModel } from "~/types/credit";
import { AppFooter } from "~/components/layouts/footer";
import { MovieHeroSection } from "./MovieHeroSection";
import {
  SectionContent,
  SectionHeader,
  SectionWrapper,
} from "~/app/_components/SectionWrapper";
import { MovieCreditsSection } from "./MovieCreditsSection";
import { CommentsSection } from "./CommentsSection";

interface MovieDetailContentProps {
  movie: MovieModel;
  comments: CommentModel[];
  credits: MovieCreditModel[];
}

export function MovieDetailContent({
  movie,
  comments,
  credits,
}: MovieDetailContentProps) {
  return (
    <div className="flex min-h-screen flex-col bg-page-bg">
      <main className="flex-grow">
        <MovieHeroSection movie={movie} />
        <SectionWrapper id="actors">
          <SectionHeader id="actors" title="Actors" />
          <SectionContent>
            <MovieCreditsSection data={credits} />
          </SectionContent>
        </SectionWrapper>
        <CommentsSection movieId={movie.id} initialComments={comments} />
      </main>
      <AppFooter />
    </div>
  );
}
