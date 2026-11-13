import type { Metadata } from "next";

// Page encore vide : on ne la propose pas aux moteurs de recherche.
export const metadata: Metadata = {
  title: "Outils",
  robots: { index: false, follow: true },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
