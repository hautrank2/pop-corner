import { httpClient } from "~/api";
import { MovieModel } from "~/types/movie";
import { CommentModel } from "~/types/comment";
import { MovieDetailContent } from "./MovieDetailContent";
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
    const movie = movieResponse.data;

    // Try to fetch comments, but don't fail if endpoint doesn't exist
    let comments: CommentModel[] = []; 
    try {
      const commentsResponse = await httpClient.get<CommentModel[]>(`/api/movie/${id}/comment`);
      comments = commentsResponse.data;
    } catch (commentError) {
      console.log("Comments endpoint not available, using empty array");
    }

    return <MovieDetailContent movie={movie} comments={comments} />;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    notFound();
  }
}