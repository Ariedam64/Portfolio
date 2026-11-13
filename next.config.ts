import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 90 pour les captures d'écran du carrousel, 75 (le défaut) ailleurs.
    qualities: [75, 90],
  },
};

export default nextConfig;
