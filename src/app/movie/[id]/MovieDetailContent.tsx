"use client";

import { MovieModel } from "~/types/movie";
import { CommentModel } from "~/types/comment";
import { MovieCreditModel } from "~/types/credit";
import { MovieHeroSection } from "./components/MovieHeroSection";
import { CommentsSection } from "./components/CommentsSection";
import { MovieCreditsSection } from "./components/MovieCreditsSection";
import { AppFooter } from "~/components/layouts/footer";
import {
  SectionContent,
  SectionHeader,
  SectionWrapper,
} from "../../_components/SectionWrapper";

interface MovieDetailContentProps {
  movie: MovieModel;
  comments: CommentModel[];
  credits: MovieCreditModel[];
}

export function MovieDetailContent({ movie, comments, credits }: MovieDetailContentProps) {
  return (
    <div className="flex min-h-screen flex-col bg-page-bg">
      <main className="flex-grow">
        <MovieHeroSection movie={movie} />
        <SectionWrapper>
          <SectionHeader title="Actors" />
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