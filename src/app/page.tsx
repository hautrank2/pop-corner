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
import { PageError } from "~/components/pages";
import Script from "next/script";

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
        <SectionWrapper id="trending" className="mt-0">
          <SectionHeader
            id="trending"
            title="Trending"
            extra={
              <Link
                href="/movie"
                className="text-secondary text-xl hover:underline"
              >
                Full movies
              </Link>
            }
          />
          <SectionContent>
            <MovieTrendingSection data={trendingMovies} />
          </SectionContent>
        </SectionWrapper>

        <SectionWrapper id="top-rated">
          <SectionHeader id="top-rated" title="Top Rated Movies" />
          <SectionContent>
            <MovieTopRatedSection data={topRatedMovies} />
          </SectionContent>
        </SectionWrapper>

        <SectionWrapper id="genres">
          <SectionHeader id="genres" title="Movie genres" />
          <SectionContent>
            <GenreSection data={genres} />
          </SectionContent>
        </SectionWrapper>

        <SectionWrapper id="actors">
          <SectionHeader id="actors" title="Featured actors" />
          <SectionContent>
            <ActorSection data={featuredActors} />
          </SectionContent>
        </SectionWrapper>

        <AppFooter />
        <Script id="homeScript" strategy="afterInteractive" src="/js/app.js" />
      </div>
    );
  } catch (err) {
    console.log(err);
  }

  return <PageError />;
}
