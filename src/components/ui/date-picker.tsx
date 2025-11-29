"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

export interface DatePickerProps {
  value?: string; // <-- RHF cung string
  onChange?: (value: string) => void; // <-- RHF yêu cầu string
  onBlur?: () => void;
  name?: string;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export const DatePicker = React.forwardRef<HTMLButtonElement, DatePickerProps>(
  (
    {
      value,
      onChange,
      onBlur,
      name,
      disabled = false,
      placeholder = "Pick a date",
      className,
    },
    ref
  ) => {
    const dateValue = value ? new Date(value) : undefined;

    const handleSelect = (date: Date | undefined) => {
      if (!onChange) return;

      if (!date) {
        onChange("");
        return;
      }

      // Convert Date → string (yyyy-MM-dd)
      const iso = date.toISOString();
      onChange(iso);
    };

    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            name={name}
            onBlur={onBlur}
            variant="outline"
            disabled={disabled}
            data-empty={!dateValue}
            className={cn(
              "data-[empty=true]:text-muted-foreground justify-start text-left font-normal",
              className
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateValue ? format(dateValue, "PPP") : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={dateValue}
            onSelect={handleSelect}
            captionLayout="dropdown"
          />
        </PopoverContent>
      </Popover>
    );
  }
);

DatePicker.displayName = "DatePicker";
