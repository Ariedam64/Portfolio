import { ReactNode } from "react";
import { cn } from "@/app/lib/utils";
import { Eyebrow } from "./Section";

interface SectionCardProps {
  title: string;
  className?: string;
  children: ReactNode;
}

/** Bloc interne d'une section ou d'un onglet : bordure neutre, titre en libellé. */
export default function SectionCard({ title, className, children }: SectionCardProps) {
  return (
    <div className={cn("rounded-xl border border-[#3E304F] bg-[#1c1b21] p-4 sm:p-5", className)}>
      <Eyebrow text={title} />
      <div className="mt-3 text-sm text-[#d4d4d8] sm:text-[15px]">{children}</div>
    </div>
  );
}
