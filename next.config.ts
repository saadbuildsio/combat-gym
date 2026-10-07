import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The MVP has no server code: export plain static files that any host (Netlify, Vercel, GitHub Pages) can serve.
  output: "export",
  trailingSlash: true,
};

export default nextConfig;
