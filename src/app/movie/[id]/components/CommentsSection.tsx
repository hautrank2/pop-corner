"use client";

import { useState } from "react";
import { CommentModel } from "~/types/comment";
import { Typography } from "~/components/ui/typography";
import { Separator } from "~/components/ui/separator";
import { CommentCard } from "./CommentCard";
import { CommentInput } from "./CommentInput";

interface CommentsSectionProps {
  movieId: string;
  initialComments: CommentModel[];
}

export function CommentsSection({ movieId, initialComments }: CommentsSectionProps) {
  const [comments, setComments] = useState<CommentModel[]>(initialComments);

  const handleSubmitComment = async (content: string) => {
    // TODO: Implement API call to post comment
    console.log("Submitting comment:", content);
    
    // Mock adding comment
    const newComment: CommentModel = {
      id: Date.now().toString(),
      userId: "current-user",
      movieId,
      content,
      createdAt: new Date().toISOString(),
    };
    
    setComments([newComment, ...comments]);
  };

  const handleReply = (commentId: string) => {
    console.log("Reply to comment:", commentId);
    // TODO: Implement reply functionality
  };

  return (
    <div className="px-16 py-8 bg-panel-bg">
      {/* Comment Header */}
      <div className="flex flex-col gap-2 mb-8">
        <Typography variant="h3" className="text-neon-pink font-semibold">
          Comment
        </Typography>
        <Separator className="bg-neon-pink h-0.5 w-[360px]" />
      </div>

      {/* Comments List */}
      <div className="flex flex-col gap-8 mb-8">
        {comments.map((comment) => (
          <CommentCard
            key={comment.id}
            comment={comment}
            onReply={handleReply}
          />
        ))}
      </div>

      {/* Comment Input */}
      <CommentInput onSubmit={handleSubmitComment} />
    </div>
  );
}