"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
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

/** Build nested comment tree from flat array */
const buildCommentTree = (comments: CommentModel[]): CommentModel[] => {
  const map = new Map<string, CommentModel>();
  const roots: CommentModel[] = [];

  comments.forEach((c) => {
    c.replies = Array.isArray(c.replies) ? c.replies : [];
    map.set(c.id, c);
  });

  comments.forEach((c) => {
    if (c.parentId) {
      const parent = map.get(c.parentId);
      if (parent) parent.replies.push(c);
      else roots.push(c);
    } else {
      roots.push(c);
    }
  });

  // remove duplicate IDs
  return Array.from(new Map(roots.map((c) => [c.id, c])).values());
};

export function CommentsSection({ movieId, initialComments }: CommentsSectionProps) {
  const { status } = useSession();
  const [comments, setComments] = useState<CommentModel[]>(() =>
    buildCommentTree(initialComments ?? [])
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchComments = async () => {
      setIsRefreshing(true);
      try {
        const res = await httpClient.get<CommentModel[]>(
          `/api/movie/${movieId}/comment`
        );

        // res.data phải là CommentModel[]
        const list: CommentModel[] = Array.isArray(res.data) ? res.data : [];

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

    if (status !== "authenticated") {
      toast.error("You must be logged in to comment.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await httpClient.post<CommentModel>(
        `/api/movie/${movieId}/comment`,
        { content, parentId }
      );

      const newComment: CommentModel | null =
        res.data && typeof res.data === "object" ? res.data : null;

      if (!newComment) {
        toast.error("Unexpected response from server.");
        return;
      }

      if (newComment.parentId) {
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
        setActiveReplyId(null);
      } else {
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
          comments.map((c, idx) => (
            <CommentCard
              key={`${c.id}-${idx}`}
              comment={c}
              onReplyClick={setActiveReplyId}
              onReplySubmit={handleSubmit}
              isReplying={activeReplyId === c.id}
              isSubmitting={isSubmitting && activeReplyId === c.id}
            />
          ))
        )}
      </div>

      {status === "authenticated" ? (
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
