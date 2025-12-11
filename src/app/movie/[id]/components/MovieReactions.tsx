"use client";

import { useState, useEffect } from "react";
import { httpClient } from "~/api";
import { ReactionType, ReactionItem } from "~/types/reaction";
import { Button } from "~/components/ui/button";
import { Typography } from "~/components/ui/typography";
import { toast } from "sonner";
import { useApp } from "~/providers";
import { ThumbsUp, Heart, Hand, Lightbulb, Laugh, Frown, Angry } from "lucide-react";
import { cn } from "~/lib/utils";

interface MovieReactionsProps {
  movieId: string;
}

const REACTION_CONFIG: Record<
  ReactionType,
  { icon: React.ComponentType<{ className?: string }>; label: string; emoji: string }
> = {
  [ReactionType.Like]: { icon: ThumbsUp, label: "Like", emoji: "👍" },
  [ReactionType.Love]: { icon: Heart, label: "Love", emoji: "❤️" },
  [ReactionType.Clap]: { icon: Hand, label: "Clap", emoji: "👏" },
  [ReactionType.Idea]: { icon: Lightbulb, label: "Idea", emoji: "💡" },
  [ReactionType.Haha]: { icon: Laugh, label: "Haha", emoji: "😂" },
  [ReactionType.Sad]: { icon: Frown, label: "Sad", emoji: "😢" },
  [ReactionType.Angry]: { icon: Angry, label: "Angry", emoji: "😠" },
};

export function MovieReactions({ movieId }: MovieReactionsProps) {
  const { state } = useApp();
  const isAuthenticated = !!state.session?.userData;

  const [reactions, setReactions] = useState<ReactionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState<ReactionType | null>(null);

  // Fetch reactions on mount
  const fetchReactions = async () => {
    try {
      const res = await httpClient.get<ReactionItem[]>(
        `/api/movie/${movieId}/reaction`
      );
      console.log("GET reactions - Response data:", res.data);
      console.log("GET reactions - Total reactions:", res.data?.length || 0);
      // Đảm bảo data là array
      const reactionData = Array.isArray(res.data) ? res.data : [];
      setReactions(reactionData);
      
      // Log số lượng theo từng reaction type
      const counts = Object.values(ReactionType)
        .filter((v) => typeof v === "number")
        .map((type) => ({
          type,
          count: reactionData.filter((r) => r.reactionType === type).length,
        }));
      console.log("Reaction counts by type:", counts);
    } catch (err: any) {
      console.error("fetchReactions error:", err);
      console.error("Error response:", err.response?.data);
      // Don't show error toast on initial load, just log it
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movieId]);

  const handleReactionClick = async (reactionType: ReactionType) => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to react.");
      return;
    }

    if (isSubmitting) {
      console.log("Already submitting, ignoring click");
      return;
    }

    const currentUserId = state.session?.userData?.id;
    console.log("Attempting to post reaction:", { reactionType, movieId, currentUserId });

    // Optimistic update: thêm reaction mới vào mảng ngay lập tức
    setReactions((prev) => {
      // Tạo một reaction item tạm thời với ID tạm
      const tempReaction: ReactionItem = {
        id: `temp-${Date.now()}`,
        movieId,
        userId: currentUserId || "",
        reactionType,
        createdAt: new Date().toISOString(),
        movie: null,
        user: null,
      };
      return [...prev, tempReaction];
    });

    setIsSubmitting(true);
    try {
      const response = await httpClient.post(`/api/movie/${movieId}/reaction`, {
        reactionType,
      });
      console.log("POST reaction success:", response.data);

      // Refresh reactions sau khi post để đảm bảo số lượng chính xác
      await fetchReactions();
      setSelectedReaction(reactionType);
    } catch (err: any) {
      console.error("postReaction error:", err);
      console.error("Error response:", err.response?.data);
      console.error("Error status:", err.response?.status);
      // Rollback optimistic update nếu có lỗi
      await fetchReactions();
      const errorMessage = err.response?.data?.message || err.message || "Failed to add reaction.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getReactionCount = (reactionType: ReactionType): number => {
    // Đếm số lượng reaction theo reactionType
    return reactions.filter((r) => r.reactionType === reactionType).length;
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-4 mt-4">
        <Typography className="text-foreground/60">Loading reactions...</Typography>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 mt-4">
      {/* <Typography variant="h5" className="text-foreground font-medium">
        Reactions
      </Typography> */}
      <div className="flex flex-wrap items-center gap-3">
        {Object.entries(REACTION_CONFIG).map(([type, config]) => {
          const reactionType = Number(type) as ReactionType;
          const count = getReactionCount(reactionType);
          const Icon = config.icon;
          const isSelected = selectedReaction === reactionType;

          return (
            <Button
              key={reactionType}
              variant="outline"
              size="sm"
              onClick={() => handleReactionClick(reactionType)}
              disabled={isSubmitting}
              className={cn(
                "flex items-center gap-2 h-auto py-2 px-3 rounded-full",
                "border-2 hover:bg-white/10 transition-colors",
                isSelected && "border-neon-pink bg-neon-pink/10"
              )}
            >
              <span className="text-lg">{config.emoji}</span>
              {count > 0 && (
                <Typography className="text-sm font-medium text-foreground">
                  {count}
                </Typography>
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

