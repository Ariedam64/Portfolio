import type { Metadata } from "next";
import { I18nProvider } from '../utils/i18n-provider';
import Sidebar from "./components/ui/Sidebar";
import ChatWidget from "./components/chat/ChatWidget";
import "./styles/globals.css";

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/mousewheel';
import 'swiper/css/keyboard';
import 'swiper/css/bundle';
import 'swiper/css/effect-coverflow';

export const metadata: Metadata = {
  title: "Hub",
  description: "",
};

export default function RootLayout({children,}: Readonly<{children: React.ReactNode;}>) {
  return (
    <html lang="fr">
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
