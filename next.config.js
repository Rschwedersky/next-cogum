/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true, // Enables stricter React development checks
    env: {
      API_URL: process.env.API_URL, // Expose API URL as an environment variable
    },
    // Other configuration options here
  };

module.exports = nextConfig
