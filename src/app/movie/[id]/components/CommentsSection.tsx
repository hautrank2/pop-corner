"use client";

import { useState, useEffect, useCallback } from "react";
import { CommentModel } from "~/types/comment";
import { Typography } from "~/components/ui/typography";
import { Separator } from "~/components/ui/separator";
import { CommentCard } from "./CommentCard";
import { CommentInput } from "./CommentInput";

interface CommentsSectionProps {
  movieId: string;
  initialComments?: CommentModel[];
}

export function CommentsSection({ movieId }: CommentsSectionProps) {
  const [comments, setComments] = useState<CommentModel[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/movie/${movieId}/comment`);
        const data: CommentModel[] = await response.json();
        setComments(data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchComments();
  }, [movieId]);

  const handleSubmitComment = async (content: string) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/movie/${movieId}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) throw new Error("Failed to post comment");

      // Cập nhật UI ngay lập tức với comment mới trả về từ API
      // thay vì phải fetch lại toàn bộ danh sách
      const newComment: CommentModel = await response.json();
      setComments((prevComments) => [newComment, ...prevComments]);
    } catch (error) {
      console.error("Error submitting comment:", error);
      // Optional: show an error message to the user
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReply = (commentId: string) => {
    console.log("Reply to comment:", commentId);
    // TODO: Implement reply functionality
  };

  return (
    <div className="px-16 py-8">
      {/* Comment Header */}
      <div className="flex flex-col gap-2 mb-8">
        <Typography variant="h3" className="text-neon-pink font-semibold">
          Comment
        </Typography>
        <Separator className="bg-neon-pink h-0.5 w-[360px]" />
      </div>

      {/* Comments List */}
      <div className="flex flex-col gap-8 mb-8">
        {isLoading ? (
          <Typography>Loading comments...</Typography>
        ) : (
          comments.map((comment) => (
            <CommentCard
              key={comment.id}
              comment={comment}
              onReply={handleReply}
            />
          ))
        )}
      </div>

      {/* Comment Input */}
      <CommentInput onSubmit={handleSubmitComment} isSubmitting={isSubmitting} />
    </div>
  );
}