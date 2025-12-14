"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { cn } from "~/lib/utils";
import { useState } from "react";
import { toast } from "sonner";
import { ReactionType } from "~/types/reaction";
import { useApp } from "~/providers";
import { httpClient } from "~/api";
import {
  Angry,
  Frown,
  Hand,
  Heart,
  Laugh,
  Lightbulb,
  ThumbsUp,
} from "lucide-react";

type ReactionPickerProps = {
  movieId: string;
  onReactionSelected?: (reactionType: ReactionType) => void;
  children: React.ReactNode;
};

const REACTION_CONFIG: Record<
  ReactionType,
  {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    emoji: string;
  }
> = {
  [ReactionType.Like]: { icon: ThumbsUp, label: "Like", emoji: "👍" },
  [ReactionType.Love]: { icon: Heart, label: "Love", emoji: "❤️" },
  [ReactionType.Clap]: { icon: Hand, label: "Clap", emoji: "👏" },
  [ReactionType.Idea]: { icon: Lightbulb, label: "Idea", emoji: "💡" },
  [ReactionType.Haha]: { icon: Laugh, label: "Haha", emoji: "😂" },
  [ReactionType.Sad]: { icon: Frown, label: "Sad", emoji: "😢" },
  [ReactionType.Angry]: { icon: Angry, label: "Angry", emoji: "😠" },
};

export function ReactionPicker({
  movieId,
  onReactionSelected,
  children,
}: ReactionPickerProps) {
  const { state } = useApp();
  const isAuthenticated = !!state.session?.userData;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReactionClick = async (reactionType: ReactionType) => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to react.");
      return;
    }

    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await httpClient.post(`/api/movie/${movieId}/reaction`, {
        reactionType,
      });

      onReactionSelected?.(reactionType);
      toast.success("Reaction added!");
    } catch (err: any) {
      console.error("postReaction error:", err);
      toast.error(
        err.response?.data?.message ?? err.message ?? "Failed to add reaction."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-block">{children}</div>
        </TooltipTrigger>

        <TooltipContent
          side="top"
          align="center"
          sideOffset={8}
          className={cn(
            "bg-panel-bg border border-white/20 rounded-full",
            "px-2 py-1 shadow-lg",
            "flex items-center gap-1",
            "animate-in fade-in-0 zoom-in-95 duration-200"
          )}
        >
          {Object.entries(REACTION_CONFIG).map(([type, config]) => {
            const reactionType = Number(type) as ReactionType;

            return (
              <button
                key={reactionType}
                onClick={() => handleReactionClick(reactionType)}
                disabled={isSubmitting}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  "hover:scale-125 transition-transform duration-200",
                  "hover:bg-white/10 active:scale-110 hover:cursor-pointer",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                <span className="text-2xl">{config.emoji}</span>
              </button>
            );
          })}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
