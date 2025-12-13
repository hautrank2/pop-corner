import Link from "next/link";
import { AlertTriangle } from "lucide-react";

import { Button } from "~/components/ui/button";

type PageErrorProps = {
  title?: string;
  description?: string;
  href?: string;
  actionLabel?: string;
};

export const PageError = ({
  title = "Something went wrong",
  description = "The page you are trying to access is unavailable or has encountered an error.",
  href = "/",
  actionLabel = "Go back to home",
}: PageErrorProps) => {
  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-background px-4">
      <div className="mx-auto flex max-w-md flex-col items-center text-center">
        {/* Big Icon */}
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border bg-card shadow-sm">
          <AlertTriangle className="h-10 w-10 text-destructive" />
        </div>

        {/* Text */}
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>

        {/* Action */}
        <Button asChild className="mt-6">
          <Link href={href}>{actionLabel}</Link>
        </Button>
      </div>
    </div>
  );
};
