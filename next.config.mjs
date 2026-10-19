/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // 90 is for the hero portrait, which is shown close to its native size.
    qualities: [75, 90],
    remotePatterns: [
      // Placeholder photography. Swap these for real shots before launch.
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "fastly.picsum.photos" },
      // Brand marks for the stack strip.
      { protocol: "https", hostname: "cdn.simpleicons.org" },
    ],
  },
};

export default nextConfig;
