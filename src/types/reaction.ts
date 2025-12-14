export enum ReactionType {
  Like = 1,
  Love = 2,
  Clap = 3,
  Idea = 4,
  Haha = 5,
  Sad = 6,
  Angry = 7,
}

export type ReactionItem = {
  id: string;
  movieId: string;
  userId: string;
  reactionType: ReactionType;
  createdAt: string;
  movie: null;
  user: null;
};

export type ReactionCount = {
  reactionType: ReactionType;
  count: number;
};

export type ReactionResponse = ReactionItem[];

