"use client";

import { useCallback, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input"; // replace with your input component or textarea
import { toast } from "sonner";

interface CommentInputProps {
  onSubmit: (content: string) => void;
  isSubmitting?: boolean;
  placeholder?: string;
}

export function CommentInput({ onSubmit, isSubmitting = false, placeholder = "Write a comment..." }: CommentInputProps) {
  const [value, setValue] = useState("");

  const handleSubmit = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      const trimmed = value.trim();
      if (!trimmed) {
        toast.error("Please write something.");
        return;
      }
      onSubmit(trimmed);
      setValue("");
    },
    [value, onSubmit]
  );

  return (
    <form onSubmit={handleSubmit} className="flex items-start gap-3">
      <Input
        value={value}
        onChange={(e) => setValue((e.target as HTMLInputElement).value)}
        placeholder={placeholder}
        className="flex-1"
      />
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Posting..." : "Post"}
      </Button>
    </form>
  );
}
