import { httpClient } from "~/api";
import { MovieModel } from "~/types/movie";
import { MovieDetailContent } from "./MovieDetailContent";
import { CommentModel } from "~/types/comment";
import { MovieCreditModel } from "~/types/credit";
import { notFound } from "next/navigation";

interface MovieDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function MovieDetailPage({ params }: MovieDetailPageProps) {
  const { id } = await params;

  try {
    const [movieResponse, commentsResponse, creditsResponse] = await Promise.all([
      httpClient.get<MovieModel>(`/api/movie/${id}`),
      httpClient.get<CommentModel[]>(`/api/movie/${id}/comment`),
      httpClient.get<MovieCreditModel[]>(`/api/movie/${id}/credits`),
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
    notFound();
  }
}
