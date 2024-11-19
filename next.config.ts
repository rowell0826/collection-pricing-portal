import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	webpack: (config, { isServer }) => {
		if (!isServer) {
			config.resolve.fallback = {
				net: false,
				tls: false,
				fs: false,
			};
		}
		return config;
	},
	images: {
		remotePatterns: [{ protocol: "https", hostname: "**" }],
	},
};

export default nextConfig;
