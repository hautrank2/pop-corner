import { MovieModel } from "~/types/movie";
import { MovieCard } from "./components/MovieCard";
import { MoviePagination } from "./components/MoviePagination";

const PAGE_SIZE = 10;

async function fetchMovies(page: number): Promise<{
  total: number;
  data: MovieModel[];
}> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/movies?page=${page}&pageSize=${PAGE_SIZE}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return { total: 0, data: [] };
  }

  return res.json();
}

export default async function MoviePage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = Number(searchParams.page) || 1;

  const { total, data: movies } = await fetchMovies(page);

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-8">Movies</h1>

      {/* Grid of cards */}
      {movies.length === 0 ? (
        <div className="text-muted-foreground">No movies found.</div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}

      <MoviePagination total={total} page={page} pageSize={PAGE_SIZE} />
    </div>
  );
}
