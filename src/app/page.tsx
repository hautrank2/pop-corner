import Link from "next/link";
import { httpClient } from "~/api";
import { ArtistModel } from "~/types/artist";
import { GenreModel } from "~/types/genre";
import { MovieModel } from "~/types/movie";
import { TableResponse } from "~/types/query";
import {
  SectionContent,
  SectionHeader,
  SectionWrapper,
} from "./_components/SectionWrapper";
import { MovieTrendingSection } from "./_components/MovieTrendingSection";
import { MovieTopRatedSection } from "./_components/MovieTopRatedSection";
import { GenreSection } from "./_components/GenreSection";
import { ActorSection } from "./_components/ActorSection";
import { AppFooter } from "~/components/layouts/footer";

export default async function Home() {
  try {
    const [moviesRes, genresRes, actorsRes] = await Promise.all([
      httpClient.get<TableResponse<MovieModel>>("/api/movie"),
      httpClient.get<GenreModel[]>("/api/genre"),
      httpClient.get<TableResponse<ArtistModel>>("/api/artist"),
    ]);

    const movies = moviesRes.data.items;
    const genres = genresRes.data;
    const actors = actorsRes.data.items;

    const trendingMovies = movies.sort((a, b) => b.view - a.view);

    const topRatedMovies = movies
      .sort((a, b) => b.avgRating - a.avgRating)
      .slice(0, 6);

    const featuredActors = actors.slice(0, 10);

    return (
      <div className="home-page pt-2">
        <SectionWrapper className="mt-0">
          <SectionHeader
            title="Trending"
            extra={
              <Link
                href={"/movie"}
                className="text-secondary hover:underline text-xl"
              >
                Full movies
              </Link>
            }
          />
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
            <GenreSection data={genres} />
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

  return <div>Page error</div>;
}
