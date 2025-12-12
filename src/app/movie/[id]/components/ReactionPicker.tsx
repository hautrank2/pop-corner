"use client";

import { useState, useRef, useEffect } from "react";
import { ReactionType } from "~/types/reaction";
import { ThumbsUp, Heart, Hand, Lightbulb, Laugh, Frown, Angry } from "lucide-react";
import { cn } from "~/lib/utils";
import { httpClient } from "~/api";
import { toast } from "sonner";
import { useApp } from "~/providers";

interface ReactionPickerProps {
  movieId: string;
  onReactionSelected?: (reactionType: ReactionType) => void;
  children: React.ReactNode;
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

export function ReactionPicker({ movieId, onReactionSelected, children }: ReactionPickerProps) {
  const { state } = useApp();
  const isAuthenticated = !!state.session?.userData;
  const [isHovered, setIsHovered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Delay hide để người dùng có thể di chuyển chuột vào popup
  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 200);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleReactionClick = async (reactionType: ReactionType) => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to react.");
      setIsHovered(false);
      return;
    }

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    try {
      await httpClient.post(`/api/movie/${movieId}/reaction`, {
        reactionType,
      });
      
      onReactionSelected?.(reactionType);
      setIsHovered(false);
      toast.success("Reaction added!");
    } catch (err: any) {
      console.error("postReaction error:", err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to add reaction.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {/* Reaction Popup */}
      {isHovered && (
        <div
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-panel-bg border-2 border-white/20 rounded-full px-2 py-1 shadow-lg z-50 flex items-center gap-1 animate-in fade-in-0 zoom-in-95 duration-200"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
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
                  "hover:bg-white/10 active:scale-110",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
                title={config.label}
              >
                <span className="text-2xl">{config.emoji}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

