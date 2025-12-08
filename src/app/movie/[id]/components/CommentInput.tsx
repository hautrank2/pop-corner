"use client";

import { useCallback, useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input"; // replace with your input component or textarea
import { Send } from "lucide-react";
import { toast } from "sonner";

interface CommentInputProps {
  onSubmit: (content: string) => void;
  isSubmitting?: boolean;
  placeholder?: string;
  mentionName?: string; // Tên người được mention khi reply
}

export function CommentInput({ 
  onSubmit, 
  isSubmitting = false, 
  placeholder = "Write a comment...",
  mentionName 
}: CommentInputProps) {
  const [value, setValue] = useState("");

  // Khi có mentionName, tự động thêm @mention vào đầu input (chỉ khi input rỗng)
  useEffect(() => {
    if (mentionName) {
      setValue(`@${mentionName} `);
    } else {
      setValue("");
    }
  }, [mentionName]);

  const handleSubmit = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      const trimmed = value.trim();
      if (!trimmed) {
        toast.error("Please write something.");
        return;
      }
      onSubmit(trimmed);
      // Reset input sau khi submit
      if (mentionName) {
        setValue(`@${mentionName} `);
      } else {
        setValue("");
      }
    },
    [value, onSubmit, mentionName]
  );

  return (
    <form onSubmit={handleSubmit} className="flex items-start gap-3">
      <Input
        value={value}
        onChange={(e) => setValue((e.target as HTMLInputElement).value)}
        placeholder={placeholder}
        className="flex-1"
      />
      <Button 
        type="submit" 
        disabled={isSubmitting}
        size="icon"
        className="shrink-0"
      >
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
}
