import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            { hostname: "place.dog" },
            {
                protocol: "https",
                hostname: "<APP_ID>.ufs.sh",
                pathname: "/f/*",
            },
        ],
        qualities: [50, 75, 100],
    },
};

export default nextConfig;
