import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [{ hostname: "place.dog" }],
        qualities: [50, 75, 100],
    },
};

export default nextConfig;
