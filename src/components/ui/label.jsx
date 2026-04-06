import { cn } from "@/lib/utils";

export function Label({
  children,
  htmlFor,
  className,
  ...props
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        "text-sm font-medium text-foreground cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </label>
  );
}
