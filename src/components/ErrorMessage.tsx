import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export default function ErrorMessage({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("text-destructive text-sm", className)}>{children}</div>
  );
}
