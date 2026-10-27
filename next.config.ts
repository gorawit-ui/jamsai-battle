import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloud Run — ใช้ image เล็ก พอร์ตจาก process.env.PORT (ข้อ 3)
  output: "standalone",
  poweredByHeader: false,
  images: {
    // รูปโปรไฟล์จาก Slack (ข้อ 9.2)
    remotePatterns: [
      { protocol: "https", hostname: "**.slack-edge.com" },
      { protocol: "https", hostname: "secure.gravatar.com" },
    ],
  },
};

export default nextConfig;
