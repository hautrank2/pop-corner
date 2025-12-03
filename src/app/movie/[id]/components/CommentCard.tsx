"use client";

import Image from "next/image";
import { Reply } from "lucide-react";
import { CommentModel } from "~/types/comment";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Typography } from "~/components/ui/typography";
import { formatRelativeTime } from "~/utils/time";

interface CommentCardProps {
  comment: CommentModel;
  onReply: (commentId: string) => void;
}

export function CommentCard({ comment, onReply }: CommentCardProps) {
  // Mock user data - in real app, this would come from the comment
  const userName = "Hau Tran";
  const userAvatar = "/images/user-avatar-default.jpg";

  return (
    <div className="flex gap-6">
      {/* Avatar */}
      <Avatar className="h-14 w-14 border-2 border-white">
        <AvatarImage src={userAvatar} alt={userName} />
        <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
      </Avatar>

      {/* Comment Content */}
      <div className="flex-1 flex flex-col gap-2">
        {/* Timestamp */}
        <Typography className="text-foreground text-sm font-normal">
          {formatRelativeTime(comment.createdAt)}
        </Typography>

        {/* Username */}
        <Typography variant="h5" className="text-foreground font-semibold">
          {userName}
        </Typography>

        {/* Comment Text */}
        <Typography className="text-foreground font-medium leading-relaxed">
          {comment.content}
        </Typography>

        {/* Reply Button */}
        <Button
          variant="ghost"
          onClick={() => onReply(comment.id)}
          className="w-fit gap-2 px-0 text-foreground hover:text-foreground/80 text-sm font-normal"
        >
          <Reply className="h-4 w-4" />
          Reply
        </Button>
      </div>
    </div>
  );
}