"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

interface CommentInputProps {
  onSubmit: (content: string) => void;
}

export function CommentInput({ onSubmit }: CommentInputProps) {
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    if (comment.trim()) {
      onSubmit(comment);
      setComment("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex items-center gap-8">
      <Input
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Write comment...."
        className="flex-1 bg-transparent border-none text-text-muted placeholder:text-text-muted text-base font-medium focus-visible:ring-0 focus-visible:ring-offset-0"
      />
      <Button
        onClick={handleSubmit}
        disabled={!comment.trim()}
        className="h-12 w-12 rounded-full bg-neon-pink hover:bg-neon-pink/90 disabled:opacity-50"
      >
        <Send className="h-6 w-6 text-white" />
      </Button>
    </div>
  );
}