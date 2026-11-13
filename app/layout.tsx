import type { Metadata } from "next";
import { Comfortaa } from "next/font/google";
import { I18nProvider } from '../utils/i18n-provider';
import Sidebar from "./components/ui/Sidebar";
import ChatWidget from "./components/chat/ChatWidget";
import { SITE_URL } from "./lib/site";
import "./styles/globals.css";

// Swiper n'utilise que la navigation et la pagination sur ce site.
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

/** Servie par Next depuis le site lui-même, sans requête vers Google au chargement. */
const comfortaa = Comfortaa({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-comfortaa",
  display: "swap",
});

const DESCRIPTION =
  "Portfolio de Romann Madeira, développeur web et logiciel : un écosystème en production autour du jeu Magic Garden (mod, API publique, back-end temps réel, application Android, maintenance par agents IA) et des outils de rétro-ingénierie.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Romann Madeira · Développeur",
    template: "%s · Romann Madeira",
  },
  description: DESCRIPTION,
  authors: [{ name: "Romann Madeira" }],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    alternateLocale: ["en_US"],
    siteName: "Romann Madeira",
    title: "Romann Madeira · Développeur",
    description: DESCRIPTION,
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({children,}: Readonly<{children: React.ReactNode;}>) {
  return (
    <html lang="fr" className={comfortaa.variable}>
      <body>
        <Sidebar />
        <I18nProvider>
          {children}
          <ChatWidget />
        </I18nProvider>
        <footer className="bg-[#18181B] text-gray-300 p-4 text-center">
          © MADEIRA Romann
        </footer>
      </body>
    </html>
  );
}
