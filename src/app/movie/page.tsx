import { MovieModel } from "~/types/movie";
import { MovieCard } from "./components/MovieCard";
import { MoviePagination } from "./components/MoviePagination";
import { httpClient } from "~/api";
import { TableResponse, TableResponseBase } from "~/types/query";
import { ServerSearchParamsDef } from "~/types/page";
import { cn } from "~/lib/utils";
import { Card } from "~/components/ui/card";
import { AppFooter } from "~/components/layouts/footer";
import { Typography } from "~/components/ui/typography";

const PAGE_SIZE = 10;

const fetchMovies = async (
  page: number
): Promise<TableResponse<MovieModel>> => {
  const res = await httpClient.get<TableResponse<MovieModel>>("/api/movie", {
    params: { page, pageSize: PAGE_SIZE },
  });

  return res.data ?? TableResponseBase;
};

export default async function MoviePage({
  searchParams: _searchParams,
}: {
  searchParams: ServerSearchParamsDef;
}) {
  const searchParams = await _searchParams;
  const page = Number(searchParams.page) || 1;

  const data = await fetchMovies(page);
  const { total, items: movies } = data;

  console.log(data);
  return (
    <div className="container mx-auto px-4 pt-4">
      <Typography variant={"h2"} className="text-secondary">
        Movies
      </Typography>

      {/* Grid of cards */}
      {movies.length === 0 ? (
        <div className="text-muted-foreground">No movies found.</div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {movies.map((movie) => (
            <Card key={movie.id} className={cn("p-0")}>
              <MovieCard data={movie} />
            </Card>
          ))}
        </div>
      )}

      <MoviePagination total={total} page={page} pageSize={PAGE_SIZE} />
      <AppFooter />
    </div>
  );
}
