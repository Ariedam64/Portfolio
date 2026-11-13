import { pageMetadata } from "@/app/lib/pageMetadata";

export const metadata = pageMetadata("/portfolio");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
