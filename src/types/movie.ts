import { ArtistModel } from "./artist";
import { CommentModel } from "./comment";
import { CreditModel } from "./credit";
import { GenreModel } from "./genre";
import { RatingModel } from "./raing";

export type MovieModel = {
  id: string; // Guid
  title: string;
  description: string;
  releaseDate: string; // ISO date string (YYYY-MM-DD)
  duration: number;
  posterUrl: string;
  trailerUrl: string;
  imgUrls: string[];
  directorId: string;
  director: ArtistModel;
  country: string;
  view: number;
  avgRating: number;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string

  // --- Navigation (optional relations) ---
  ratings: RatingModel[];
  comments: CommentModel[];
  credits: CreditModel[];

  genreIds: string[];
  genres: GenreModel[];
};
