import { pageMetadata } from "@/app/lib/pageMetadata";

export const metadata = pageMetadata("/portfolio/projects/frida");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
