"use client";

import { Reply } from "lucide-react";
import { CommentModel } from "~/types/comment";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Typography } from "~/components/ui/typography";
import { formatRelativeTime } from "~/utils/time";
import { getAssetUrl } from "~/utils/asset";
import { CommentInput } from "./CommentInput";
import Image from "next/image";

interface CommentCardProps {
  comment: CommentModel;
  onReplyClick: (commentId: string | null) => void;
  onReplySubmit: (content: string, parentId: string) => void;
  isSubmitting: boolean;
  // Thay đổi: Bắt buộc truyền activeReplyId để tính toán trạng thái
  activeReplyId: string | null; 
}

export function CommentCard({
  comment,
  onReplyClick,
  onReplySubmit,
  isSubmitting,
  activeReplyId,
}: CommentCardProps) {
  // Logic: Tự xác định xem mình có đang được reply hay không
  const isReplying = activeReplyId === comment.id;

  // Hỗ trợ cả author và user (nếu API trả về field name khác)
  const author = (comment as any).author || (comment as any).user;
  const authorName = author?.name;
  const authorAvatarUrl = author?.avatarUrl;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <div className="w-12 h-12 rounded-full overflow-hidden relative">
          <Image
          className="rounded-full object-cover"
            fill
            src={
              authorAvatarUrl
                ? getAssetUrl(authorAvatarUrl)
                : "/images/user-avatar-default.jpg"
            }
            alt={authorName || "User"}
          />
        </div>
        
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <Typography variant="h5" className="text-foreground font-semibold">
              {authorName ?? "Unknown"}
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
            // Logic: Nếu đang reply chính nó thì tắt (null), ngược lại thì set ID của nó
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
          {comment.replies.map((reply) => (
            <CommentCard
              key={reply.id} 
              comment={reply}
              onReplyClick={onReplyClick}
              onReplySubmit={onReplySubmit}
              isSubmitting={isSubmitting}
              activeReplyId={activeReplyId} 
            />
          ))}
        </div>
      )}
    </div>
  );
}