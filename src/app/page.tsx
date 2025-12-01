import { cookies } from "next/headers";
import { httpClient } from "~/api";
import { SESSION_USER_LOCAL } from "~/lib/session";
import { ArtistModel } from "~/types/artist";
import { GenreModel } from "~/types/genre";
import { MovieModel } from "~/types/movie";
import { TableResponse } from "~/types/query";
import {
  SectionContent,
  SectionHeader,
  SectionWrapper,
} from "./components/SectionWrapper";
import { MovieTrendingSection } from "./components/MovieTrendingSection";
import { MovieTopRatedSection } from "./components/MovieTopRatedSection";
import { GenreSection } from "./components/GenreSection";
import { ActorSection } from "./components/ActorSection";
import { AppFooter } from "~/components/layouts/footer";

export default async function Home() {
  const cookie = await cookies();
  const userData = cookie.get(SESSION_USER_LOCAL);

  try {
    const movieQuery = await httpClient.get<TableResponse<MovieModel>>(
      "/api/movie"
    );
    const genreQuery = await httpClient.get<GenreModel[]>("/api/genre");
    const artisQuery = await httpClient.get<TableResponse<ArtistModel>>(
      "/api/artist"
    );

    const trendingMovies = movieQuery.data.items.sort(
      (a, b) => b.view - a.view
    );

    const topRatedMovies = movieQuery.data.items
      .sort((a, b) => b.avgRating - a.avgRating)
      .slice(0, 6);

    const featuredActors = artisQuery.data.items.slice(0, 10);

    return (
      <div className="home-page pt-2">
        <SectionWrapper className="mt-0">
          <SectionHeader title="Trending" />
          <SectionContent>
            <MovieTrendingSection data={trendingMovies} />
          </SectionContent>
        </SectionWrapper>

        <SectionWrapper>
          <SectionHeader title="Top Rated Movies" />
          <SectionContent>
            <MovieTopRatedSection data={topRatedMovies} />
          </SectionContent>
        </SectionWrapper>

        <SectionWrapper>
          <SectionHeader title="Movie genres" />
          <SectionContent>
            <GenreSection data={genreQuery.data} />
          </SectionContent>
        </SectionWrapper>

        <SectionWrapper>
          <SectionHeader title="Featured actors" />
          <SectionContent>
            <ActorSection data={featuredActors} />
          </SectionContent>
        </SectionWrapper>

        <AppFooter />
      </div>
    );
  } catch (err) {
    console.log(err);
  }

  return <div></div>;
}
