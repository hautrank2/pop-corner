"use client";

import { useEffect, useState } from "react";
import { useApp } from "~/providers";
import { internalHttpClient } from "~/api";
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

  // Fetch lại comment khi movieId thay đổi
  useEffect(() => {
    let mounted = true;

    const fetchComments = async () => {
      setIsRefreshing(true);
      try {
        const res = await internalHttpClient.get<CommentModel[]>(
          `/api/movie/${movieId}/comment`
        );

        const list: CommentModel[] = Array.isArray(res.data) ? res.data : [];
        
        // Debug: Log để kiểm tra cấu trúc dữ liệu
        if (list.length > 0) {
          console.log("Sample comment data:", list[0]);
        }
        
        // Lọc unique ID trước khi build tree
        const uniqueList = Array.from(new Map(list.map((c) => [c.id, c])).values());

        if (mounted) setComments(buildCommentTree(uniqueList));
      } catch (err) {
        console.error("fetchComments error:", err);
        toast.error("Could not load comments.");
      } finally {
        if (mounted) setIsRefreshing(false);
      }
    };

    fetchComments();

    return () => {
      mounted = false;
    };
  }, [movieId]);

  const handleSubmit = async (content: string, parentId: string | null = null) => {
    if (!content?.trim()) return;

    if (!isAuthenticated) {
      toast.error("You must be logged in to comment.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await internalHttpClient.post<CommentModel>(
        `/api/movie/${movieId}/comment`,
        { content, parentId }
      );

      const newComment: CommentModel | null =
        res.data && typeof res.data === "object" ? res.data : null;

      if (!newComment) {
        toast.error("Unexpected response from server.");
        return;
      }

      // Cập nhật UI ngay lập tức
      if (newComment.parentId) {
        // Logic đệ quy tìm cha để nhét con vào
        setComments((prev) => {
          const addReply = (list: CommentModel[]): CommentModel[] =>
            list.map((c) => {
              if (c.id === newComment.parentId) {
                return { ...c, replies: [...(c.replies ?? []), newComment] };
              }
              if (c.replies?.length) {
                return { ...c, replies: addReply(c.replies) };
              }
              return c;
            });
          return addReply(prev);
        });
        // Đóng form reply sau khi submit thành công
        setActiveReplyId(null);
      } else {
        // Comment gốc thì thêm lên đầu
        setComments((prev) => [{ ...newComment, replies: [] }, ...prev]);
      }

      toast.success("Comment posted!");
    } catch (err) {
      console.error("post comment error:", err);
      toast.error("Failed to post comment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="px-16 py-8">
      <div className="flex flex-col gap-2 mb-8">
        <Typography variant="h3" className="text-neon-pink font-semibold">
          Comments
        </Typography>
        <Separator className="bg-neon-pink h-0.5 w-[360px]" />
      </div>

      <div className="flex flex-col gap-6 mb-8">
        {isRefreshing && comments.length === 0 ? (
          <Typography>Loading comments...</Typography>
        ) : comments.length === 0 ? (
          <Typography>No comments yet. Be the first!</Typography>
        ) : (
          comments.map((c) => (
            <CommentCard
              key={c.id} 
              comment={c}
              onReplyClick={setActiveReplyId}
              onReplySubmit={handleSubmit}
              activeReplyId={activeReplyId}
              isSubmitting={isSubmitting}
            />
          ))
        )}
      </div>

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
  );
}