export interface Author {
  id: string;
  name: string;
  avatarUrl: string;
}

export interface CommentModel {
  id: string;
  author: Author;
  content: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
  replies: CommentModel[];
}
