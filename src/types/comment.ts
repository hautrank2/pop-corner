export interface Author {
  id: string;
  name: string;
  avatarUrl: string;
}

export interface CommentModel {
  id: string;
  author: Author;
  content: string;
  createdAt: string;
  replies: CommentModel[];
}