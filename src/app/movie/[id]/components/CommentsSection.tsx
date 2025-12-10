"use client";

import { useState } from "react";
import { useApp } from "~/providers";
import { httpClient } from "~/api";
import { CommentModel } from "~/types/comment";
import { CommentCard } from "./CommentCard";
import { CommentInput } from "./CommentInput";
import { Typography } from "~/components/ui/typography";
import { Separator } from "~/components/ui/separator";
import { toast } from "sonner";

interface CommentsSectionProps {
  movieId: string;
  initialComments: CommentModel[];
}

const buildCommentTree = (comments: CommentModel[]): CommentModel[] => {
  const map = new Map<string, CommentModel>();
  const roots: CommentModel[] = [];

  // 1. Khởi tạo map và reset mảng replies để tránh duplicate dữ liệu cũ
  comments.forEach((c) => {
    // Clone object để không mutate dữ liệu gốc
    map.set(c.id, { ...c, replies: [] });
  });

  // 2. Xây dựng cây
  comments.forEach((c) => {
    const node = map.get(c.id);
    if (!node) return;

    if (c.parentId && map.has(c.parentId)) {
      const parent = map.get(c.parentId);
      parent!.replies!.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
};

export function CommentsSection({ movieId, initialComments }: CommentsSectionProps) {
  const { state } = useApp();
  const isAuthenticated = !!state.session?.userData;
  
  // State quản lý danh sách comment dạng cây
  const [comments, setComments] = useState<CommentModel[]>(() =>
    buildCommentTree(initialComments ?? [])
  );
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);

  // Fetch lại comments từ server
  const fetchComments = async () => {
    setIsRefreshing(true);
    try {
      const res = await httpClient.get<CommentModel[]>(
        `/api/movie/${movieId}/comment`
      );

      const list: CommentModel[] = Array.isArray(res.data) ? res.data : [];
      
      // Lọc unique ID trước khi build tree
      const uniqueList = Array.from(new Map(list.map((c) => [c.id, c])).values());

      setComments(buildCommentTree(uniqueList));
    } catch (err) {
      console.error("fetchComments error:", err);
      toast.error("Could not load comments.");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSubmit = async (content: string, parentId: string | null = null) => {
    if (!content?.trim()) return;

    if (!isAuthenticated) {
      toast.error("You must be logged in to comment.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Chỉ gửi parentId nếu có giá trị (không gửi null)
      const payload: { content: string; parentId?: string } = { content: content.trim() };
      if (parentId) {
        payload.parentId = parentId;
      }
      
      const res = await httpClient.post<CommentModel>(
        `/api/movie/${movieId}/comment`,
        payload
      );

      const newComment: CommentModel | null =
        res.data && typeof res.data === "object" ? res.data : null;

      if (!newComment) {
        toast.error("Unexpected response from server.");
        return;
      }

      // Refetch comments để sync với server
      await fetchComments();
      
      // Đóng form reply sau khi submit thành công
      if (parentId) {
        setActiveReplyId(null);
      }

      toast.success("Comment posted!");
    } catch (err: any) {
      console.error("post comment error:", err);
      console.error("Error response:", err.response?.data);
      console.error("Error status:", err.response?.status);
      
      // Hiển thị thông báo lỗi chi tiết hơn
      const errorMessage = err.response?.data?.message || err.message || "Failed to post comment.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (commentId: string, content: string) => {
    if (!content?.trim()) return;

    if (!isAuthenticated) {
      toast.error("You must be logged in to update comments.");
      return;
    }
    console.log("commentId", commentId);

    setIsSubmitting(true);

    try {
      const res = await httpClient.put<CommentModel>(
        `/api/movie/${movieId}/comment/${commentId}`,
        { content: content.trim() }
      );

      const updatedComment: CommentModel | null =
        res.data && typeof res.data === "object" ? res.data : null;

      if (!updatedComment) {
        toast.error("Unexpected response from server.");
        return;
      }

      // Refetch comments để sync với server
      await fetchComments();

      setEditingCommentId(null);
      toast.success("Comment updated!");
    } catch (err: any) {
      console.error("update comment error:", err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to update comment.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to delete comments.");
      return;
    }

    if (!confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    setIsSubmitting(true);

    try {
      await httpClient.delete(`/api/movie/${movieId}/comment/${commentId}`);

      // Refetch comments để sync với server
      await fetchComments();

      setEditingCommentId(null);
      toast.success("Comment deleted!");
    } catch (err: any) {
      console.error("delete comment error:", err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to delete comment.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="px-16 py-8 flex flex-col h-full">
      {/* Background xám nhạt bọc cả header, comment và post comment */}
      <div className="bg-gray-100/30 dark:bg-gray-800/30 rounded-lg p-6 flex flex-col h-full">
        {/* Header Comments */}
        <div className="flex flex-col gap-2 mb-6">
          <Typography variant="h3" className="text-neon-pink font-semibold">
            Comments
          </Typography>
          <Separator className="bg-neon-pink h-0.5 w-[360px]" />
        </div>

        {/* Phần comment có thể scroll */}
        <div className="flex-1 overflow-y-auto mb-6 max-h-[600px]">
          <div className="flex flex-col gap-6">
            {isRefreshing && comments.length === 0 ? (
              <Typography>Loading comments...</Typography>
            ) : comments.length === 0 ? (
              <Typography className="text-center text-foreground/70">
                No comments yet. Be the first!
              </Typography>
            ) : (
              comments.map((c) => (
                <CommentCard
                  key={c.id} 
                  comment={c}
                  onReplyClick={setActiveReplyId}
                  onReplySubmit={handleSubmit}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                  activeReplyId={activeReplyId}
                  editingCommentId={editingCommentId}
                  onEditClick={setEditingCommentId}
                  isSubmitting={isSubmitting}
                  currentUserId={state.session?.userData?.id}
                  depth={0}
                />
              ))
            )}
          </div>
        </div>

        {/* Phần post comment giữ nguyên, không scroll */}
        <div className="flex-shrink-0 border-t border-gray-300/50 dark:border-gray-700/50 pt-6">
          {isAuthenticated ? (
            <>
              <Typography variant="h4" className="mb-4 font-semibold">
                Leave a Comment
              </Typography>
              <CommentInput
                onSubmit={(content) => handleSubmit(content, null)}
                isSubmitting={isSubmitting && !activeReplyId}
              />
            </>
          ) : (
            <Typography className="text-center text-foreground/70">
              You must be logged in to comment.
            </Typography>
          )}
        </div>
      </div>
    </div>
  );
}