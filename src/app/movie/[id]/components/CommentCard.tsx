"use client";

import { Reply } from "lucide-react";
import { CommentModel } from "~/types/comment";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Typography } from "~/components/ui/typography";
import { formatRelativeTime } from "~/utils/time";
import { CommentInput } from "./CommentInput";

interface CommentCardProps {
  comment: CommentModel;
  onReplyClick: (commentId: string | null) => void;
  onReplySubmit: (content: string, parentId: string) => void;
  isReplying: boolean;
  isSubmitting: boolean;
  activeReplyId?: string | null;
}

export function CommentCard({
  comment,
  onReplyClick,
  onReplySubmit,
  isReplying,
  isSubmitting,
}: CommentCardProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <Avatar className="h-12 w-12 border-2 border-white">
          <AvatarImage
            src={comment.author?.avatarUrl || "/default-avatar.png"}
            alt={comment.author?.name || "User"}
          />
          <AvatarFallback>
            {comment.author?.name?.charAt(0) ?? "U"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <Typography variant="h5" className="text-foreground font-semibold">
              {comment.author?.name ?? "Unknown"}
            </Typography>
            <Typography className="text-foreground/60 text-sm font-normal">
              {formatRelativeTime(comment.createdAt)}
            </Typography>
          </div>
          <Typography className="text-foreground font-medium leading-relaxed">
            {comment.content}
          </Typography>
          <Button
            variant="ghost"
            onClick={() => onReplyClick(isReplying ? null : comment.id)}
            className="w-fit gap-2 px-0 text-foreground hover:text-foreground/80 text-sm font-normal"
          >
            <Reply className="h-4 w-4" />
            {isReplying ? "Cancel" : "Reply"}
          </Button>
        </div>
      </div>

      {isReplying && (
        <div className="pl-16">
          <CommentInput
            onSubmit={(content) => onReplySubmit(content, comment.id)}
            isSubmitting={isSubmitting}
          />
        </div>
      )}

      {comment.replies?.length > 0 && (
        <div className="pl-16 flex flex-col gap-4 border-l-2 border-gray-700">
          {comment.replies.map((reply, idx) => (
            <CommentCard
              key={`${reply.id}-${idx}`} // unique key
              comment={reply}
              onReplyClick={onReplyClick}
              onReplySubmit={onReplySubmit}
              isReplying={isReplying && reply.id === reply.id}
              isSubmitting={isSubmitting}
            />
          ))}
        </div>
      )}
    </div>
  );
}
