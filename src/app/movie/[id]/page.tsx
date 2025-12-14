import { MovieModel } from "~/types/movie";
import { MovieDetailContent } from "./MovieDetailContent";
import { CommentModel } from "~/types/comment";
import { MovieCreditModel } from "~/types/credit";
import { notFound } from "next/navigation";
import { httpServer } from "~/app/libs/server-http";

interface MovieDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function MovieDetailPage({
  params,
}: MovieDetailPageProps) {
  const { id } = await params;

  try {
    const http = await httpServer();
    const [movieResponse, commentsResponse, creditsResponse] =
      await Promise.all([
        http.get<MovieModel>(`/api/movie/${id}`),
        http.get<CommentModel[]>(`/api/movie/${id}/comment`),
        http.get<MovieCreditModel[]>(`/api/movie/${id}/credits`),
      ]);

    const credits = creditsResponse.data;

    return (
      <MovieDetailContent
        movie={movieResponse.data}
        comments={commentsResponse.data}
        credits={credits}
      />
    );
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return <div>{JSON.stringify(error)}</div>;
  }
}
