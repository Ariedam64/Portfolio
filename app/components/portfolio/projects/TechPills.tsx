import { cn } from "@/app/lib/utils";

interface TechPillsProps {
  items: string[];
  /** Au-delà, les technos restantes sont résumées en « +N ». */
  max?: number;
  className?: string;
}

export default function TechPills({ items, max = items.length, className }: TechPillsProps) {
  const shown = items.slice(0, max);
  const hidden = items.slice(max);

  return (
    <ul className={cn("flex flex-wrap gap-1.5", className)} aria-label="Technologies">
      {shown.map((tech) => (
        <li key={tech} className="rounded-full border border-[#3E304F] bg-[#27272A] px-2.5 py-0.5 text-xs text-gray-200">
          {tech}
        </li>
      ))}
      {hidden.length > 0 && (
        <li title={hidden.join(", ")} className="rounded-full border border-dashed border-[#3E304F] px-2.5 py-0.5 text-xs text-[#a1a1aa]">
          +{hidden.length}
        </li>
      )}
    </ul>
  );
}
