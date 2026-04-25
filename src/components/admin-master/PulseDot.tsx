import { cn } from "@/lib/utils";

export const PulseDot = ({ tone = "green" }: { tone?: "green" | "red" | "amber" }) => {
  const colors = {
    green: "bg-emerald-500",
    red: "bg-red-500",
    amber: "bg-amber-500",
  } as const;
  return (
    <span className="relative inline-flex h-2.5 w-2.5">
      <span className={cn("absolute inset-0 animate-ping rounded-full opacity-60", colors[tone])} />
      <span className={cn("relative inline-flex h-2.5 w-2.5 rounded-full", colors[tone])} />
    </span>
  );
};
