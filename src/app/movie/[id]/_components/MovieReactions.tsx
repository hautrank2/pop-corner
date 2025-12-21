"use client";

import { useState, useEffect } from "react";
import { httpClient } from "~/api";
import { ReactionType, ReactionItem } from "~/types/reaction";
import { Typography } from "~/components/ui/typography";
import { cn } from "~/lib/utils";

interface MovieReactionsProps {
  movieId: string;
}

const REACTION_CONFIG: Record<ReactionType, { label: string; emoji: string }> =
  {
    [ReactionType.Like]: { label: "Like", emoji: "👍" },
    [ReactionType.Love]: { label: "Love", emoji: "❤️" },
    [ReactionType.Clap]: { label: "Clap", emoji: "👏" },
    [ReactionType.Idea]: { label: "Idea", emoji: "💡" },
    [ReactionType.Haha]: { label: "Haha", emoji: "😂" },
    [ReactionType.Sad]: { label: "Sad", emoji: "😢" },
    [ReactionType.Angry]: { label: "Angry", emoji: "😠" },
  };

export function MovieReactions({ movieId }: MovieReactionsProps) {
  const [reactions, setReactions] = useState<ReactionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReactions();
  }, [movieId]);

  const getReactionCount = (reactionType: ReactionType): number => {
    // Đếm số lượng reaction theo reactionType
    return reactions.filter((r) => r.reactionType === reactionType).length;
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-4 mt-4">
        <Typography className="text-foreground/60">
          Loading reactions...
        </Typography>
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

          // Chỉ hiển thị nếu có reaction
          if (count === 0) return null;

          return (
            <div
              key={reactionType}
              className={cn(
                "flex items-center gap-2 h-auto py-2 px-3 rounded-full",
                "bg-card"
              )}
            >
              <span className="text-lg">{config.emoji}</span>
              <Typography className="text-sm font-medium text-foreground">
                {count}
              </Typography>
            </div>
          );
        })}
      </div>
    </div>
  );
}
