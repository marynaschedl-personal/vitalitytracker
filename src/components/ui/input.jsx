import { cn } from "@/lib/utils";

export function Input({
  className,
  type = "text",
  ...props
}) {
  return (
    <input
      type={type}
      className={cn(
        "w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all",
        className
      )}
      {...props}
    />
  );
}
