import { httpClient } from "~/api";
import { MovieModel } from "~/types/movie";
import { MovieDetailContent } from "./MovieDetailContent";
import { CommentModel } from "~/types/comment";
import { notFound } from "next/navigation";

interface MovieDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function MovieDetailPage({ params }: MovieDetailPageProps) {
  const { id } = await params;

  try {
    const movieResponse = await httpClient.get<MovieModel>(`/api/movie/${id}`);
    const commentsResponse = await httpClient.get<CommentModel[]>(
      `/api/movie/${id}/comment`
    );

    return (
      <MovieDetailContent
        movie={movieResponse.data}
        comments={commentsResponse.data}
      />
    );
  } catch (error) {
    console.error("Error fetching movie details:", error);
    notFound();
  }
}
