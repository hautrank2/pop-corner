"use client";

import { Reply, Edit2, Trash2 } from "lucide-react";
import { CommentModel } from "~/types/comment";
import { Button } from "~/components/ui/button";
import { Typography } from "~/components/ui/typography";
import { formatRelativeTime } from "~/utils/time";
import { getAssetUrl } from "~/utils/asset";
import { CommentInput } from "./CommentInput";
import Image from "next/image";

interface CommentCardProps {
  comment: CommentModel;
  parentComment?: CommentModel;
  onReplyClick: (commentId: string | null) => void;
  onReplySubmit: (content: string, parentId: string) => void;
  onUpdate?: (commentId: string, content: string) => void;
  onDelete?: (commentId: string) => void;
  isSubmitting: boolean;
  // Thay đổi: Bắt buộc truyền activeReplyId để tính toán trạng thái
  activeReplyId: string | null;
  editingCommentId?: string | null;
  onEditClick?: (commentId: string | null) => void;
  currentUserId?: string;
  // Độ sâu của comment trong cây (0 = root, 1 = reply level 1, 2 = reply level 2)
  depth?: number;
  isAuthenticated: boolean;
}

export function CommentCard({
  comment,
  onReplyClick,
  onReplySubmit,
  onUpdate,
  onDelete,
  isSubmitting,
  activeReplyId,
  editingCommentId,
  onEditClick,
  currentUserId,
  depth = 0,
  isAuthenticated,
  parentComment,
}: CommentCardProps) {
  // Logic: Tự xác định xem mình có đang được reply hay không
  const isReplying = activeReplyId === comment.id;
  const isEditing = editingCommentId === comment.id;

  // Hỗ trợ cả author và user (nếu API trả về field name khác)
  const author = (comment as any).author || (comment as any).user;
  const authorName = author?.name;
  const authorAvatarUrl = author?.avatarUrl;
  const authorId = author?.id;

  // Kiểm tra xem user hiện tại có phải là chủ sở hữu comment không
  const isOwner = currentUserId && authorId && currentUserId === authorId;

  // Giới hạn 3 cấp: chỉ cho phép reply ở cấp 0, 1, 2 (không cho reply ở cấp 3)
  const canReply = depth < 2;

  console.log(parentComment);
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
          {isEditing && onUpdate ? (
            <div className="flex flex-col gap-2">
              <CommentInput
                onSubmit={(content) => onUpdate(comment.id, content)}
                isSubmitting={isSubmitting}
                initialValue={comment.content}
                onCancel={() => onEditClick?.(null)}
              />
            </div>
          ) : (
            <>
              <Typography className="text-foreground font-medium leading-relaxed whitespace-pre-wrap">
                {parentComment && (
                  <span className="text-secondary">
                    @{parentComment.user.name}
                  </span>
                )}{" "}
                {comment.content}
              </Typography>

              <div className="flex items-center gap-2">
                {canReply && isAuthenticated && (
                  <Button
                    size={"sm"}
                    variant="ghost"
                    // Logic: Nếu đang reply chính nó thì tắt (null), ngược lại thì set ID của nó
                    onClick={() => onReplyClick(isReplying ? null : comment.id)}
                    className="w-fit gap-2 px-0 text-foreground hover:text-foreground/80 text-sm font-normal"
                  >
                    <Reply className="h-4 w-4" />
                    {isReplying ? "Cancel" : "Reply"}
                  </Button>
                )}
                {isOwner && onUpdate && onDelete && onEditClick && (
                  <>
                    <Button
                      variant="ghost"
                      onClick={() => onEditClick(isEditing ? null : comment.id)}
                      className="w-fit gap-2 px-0 text-foreground hover:text-foreground/80 text-sm font-normal"
                      disabled={isSubmitting}
                      size={"sm"}
                    >
                      <Edit2 className="h-4 w-4" />
                      {isEditing ? "Cancel" : "Edit"}
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => onDelete(comment.id)}
                      className="w-fit gap-2 px-0 text-foreground hover:text-red-500 text-sm font-normal"
                      disabled={isSubmitting}
                      size={"sm"}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {isReplying && (
        <div className="pl-16">
          <CommentInput
            onSubmit={(content) => onReplySubmit(content, comment.id)}
            isSubmitting={isSubmitting}
            mentionName={authorName}
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
              onUpdate={onUpdate}
              onDelete={onDelete}
              isSubmitting={isSubmitting}
              activeReplyId={activeReplyId}
              editingCommentId={editingCommentId}
              onEditClick={onEditClick}
              currentUserId={currentUserId}
              depth={depth + 1}
              isAuthenticated={isAuthenticated}
              parentComment={comment}
            />
          ))}
        </div>
      )}
    </div>
  );
}
