import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [{ hostname: "place.dog" }],
    },
};

export default nextConfig;
