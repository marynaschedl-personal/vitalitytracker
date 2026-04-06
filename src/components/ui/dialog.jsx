import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export function Dialog({ open, onOpenChange, children }) {
  return (
    <>
      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          {children}
        </div>
      )}
    </>
  );
}

export function DialogContent({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "bg-card border border-border rounded-lg shadow-lg max-w-md w-full p-6",
        className
      )}
      onClick={(e) => e.stopPropagation()}
      {...props}
    >
      {children}
    </div>
  );
}

export function DialogHeader({ className, ...props }) {
  return <div className={cn("mb-4", className)} {...props} />;
}

export function DialogTitle({ className, ...props }) {
  return <h2 className={cn("text-lg font-bold text-foreground", className)} {...props} />;
}

export function DialogClose({ onOpenChange }) {
  return (
    <button
      onClick={() => onOpenChange?.(false)}
      className="absolute top-4 right-4 p-1 hover:bg-secondary rounded-lg"
    >
      <X className="w-5 h-5" />
    </button>
  );
}
