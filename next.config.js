/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["images.pond5.com", "icon-library.com", "cdn.pixabay.com"],
  },
};

module.exports = nextConfig;
