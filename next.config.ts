import type { NextConfig } from "next";

try {
  const nextConfig: NextConfig = {
    /* config options here */
  };
  module.exports = nextConfig;
} catch (error) {
  console.error("Error in next.config.js:", error);
  module.exports = {};
}