"use client";

import { useCallback, useState, useEffect, useRef } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input"; // replace with your input component or textarea
import { Send, X } from "lucide-react";
import { toast } from "sonner";

interface CommentInputProps {
  onSubmit: (content: string) => void;
  isSubmitting?: boolean;
  placeholder?: string;
  mentionName?: string;
  initialValue?: string;
  onCancel?: () => void;
}

export function CommentInput({
  onSubmit,
  isSubmitting = false,
  placeholder = "Write a comment...",
  mentionName,
  initialValue,
  onCancel,
}: CommentInputProps) {
  const [value, setValue] = useState(initialValue || "");
  const inputRef = useRef<HTMLInputElement>(null);
  // Khi có initialValue, set giá trị ban đầu
  useEffect(() => {
    if (initialValue !== undefined) {
      setValue(initialValue);
    }
  }, [initialValue]);

  // Khi có mentionName, tự động thêm @mention vào đầu input (chỉ khi input rỗng và không có initialValue)
  useEffect(() => {
    if (mentionName && !initialValue) {
      setValue(``);
    } else if (!mentionName && !initialValue) {
      setValue("");
    }
  }, [mentionName, initialValue]);

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
        setValue(``);
      } else {
        setValue("");
      }
    },
    [value, onSubmit, mentionName]
  );

  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  return (
    <form onSubmit={handleSubmit} className="flex items-start gap-3">
      <Input
        ref={inputRef}
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
      {onCancel && (
        <Button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          variant="ghost"
          size="icon"
          className="shrink-0"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </form>
  );
}
