import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            { hostname: "place.dog" },
            {
                protocol: "https",
                hostname: "7p6b2m8uq7.ufs.sh",
                pathname: "/f/*",
            },
        ],
        qualities: [50, 75, 100],
    },
};

export default nextConfig;
