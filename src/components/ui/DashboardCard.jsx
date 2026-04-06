import { cn } from "@/lib/utils";

export default function DashboardCard({ children, className, onClick }) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-card rounded-2xl p-5 transition-all duration-200",
        onClick && "cursor-pointer active:scale-[0.98]",
        className
      )}
    >
      {children}
    </div>
  );
}
