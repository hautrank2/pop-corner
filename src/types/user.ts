import { CommentModel } from "./comment";
import { RatingModel } from "./rating";

export type UserModel = {
  id: string; // Guid
  email: string;
  name: string;
  birthday: string; // ISO string (yyyy-MM-dd), C# Column(TypeName="date")
  avatarUrl: string;
  role: string;

  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime

  // Navigation
  ratings: RatingModel[];
  comments: CommentModel[];
};
