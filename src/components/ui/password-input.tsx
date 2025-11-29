import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "~/lib/utils";
import { Input } from "./input";

type PasswordInputProps = React.ComponentProps<"input">;

export const PasswordInput = React.forwardRef<
  HTMLInputElement,
  PasswordInputProps
>(({ className, ...props }, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="relative">
      <Input
        ref={ref}
        // luôn control type ở đây
        type={showPassword ? "text" : "password"}
        className={cn("pr-9", className)} // chừa chỗ cho icon bên phải
        {...props}
      />

      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
        tabIndex={-1} // không focus vào nút khi tab (tuỳ bạn thích)
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Eye className="h-4 w-4" aria-hidden="true" />
        )}
      </button>
    </div>
  );
});

PasswordInput.displayName = "PasswordInput";
