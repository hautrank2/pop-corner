"use client";

import { useState } from "react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Send } from "lucide-react";

interface CommentInputProps {
  onSubmit: (content: string) => void;
  isSubmitting: boolean;
}

export function CommentInput({ onSubmit, isSubmitting }: CommentInputProps) {
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    if (content.trim() && !isSubmitting) {
      onSubmit(content);
      setContent("");
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="flex items-center gap-4">
      <Input
        placeholder="Write a comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={isSubmitting} // Vô hiệu hóa khi đang gửi
        className="bg-transparent border-gray-600 focus:border-neon-pink"
      />
      <Button onClick={handleSubmit} disabled={isSubmitting} size="icon">
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
}