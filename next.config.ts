import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  // GitHub Pages project site serves from /<repo-name>/, not the domain root.
  basePath: "/tiny-tests",
};

export default nextConfig;
