import { cn } from "@/lib/utils";

export function Slider({
  value,
  onChange,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  className,
  ...props
}) {
  const handleChange = onValueChange || onChange;

  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value?.[0] || value}
      onChange={(e) => handleChange([parseFloat(e.target.value)])}
      className={cn(
        "w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary",
        "slider",
        className
      )}
      {...props}
    />
  );
}
