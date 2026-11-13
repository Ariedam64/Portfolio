import type { Metadata } from "next";
import HubPage from "./components/HUB/HubPage";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return <HubPage />;
}
