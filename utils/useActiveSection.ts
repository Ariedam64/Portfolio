import { useEffect, useState } from "react";

export default function useActiveSection(sectionIds: string[]) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (sectionIds.length === 0) {
      setActive(null);
      return;
    }
    const handleScroll = () => {
      const offsets = sectionIds.map((id) => {
        const el = document.getElementById(id);
        if (!el) return { id, top: Infinity };
        const rect = el.getBoundingClientRect();
        return { id, top: Math.abs(rect.top) };
      });

      const closest = offsets.reduce((prev, curr) =>
        curr.top < prev.top ? curr : prev
      );

      setActive(closest.id);
    };

    handleScroll(); 
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sectionIds]);

  return active;
}
