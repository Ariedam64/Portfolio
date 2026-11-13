import { pageMetadata } from "@/app/lib/pageMetadata";

export const metadata = pageMetadata("/outils");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
