/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    serverActions: {
      // Allow multipart overhead and two files of up to 50 MB each.
      bodySizeLimit: "110mb",
    },
  },
  async headers() {
    return [{
      source: "/:path*",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      ],
    }];
  },
  env: {
    // Server-to-server API calls. Must stay internal: going through the public
    // domain breaks behind the HTTPS proxy (301 turns POST into GET, or the
    // container cannot reach its own public address).
    BASE_URL:
      process.env.NODE_ENV == "production"
        ? process.env.INTERNAL_BASE_URL || `http://127.0.0.1:${process.env.PORT || 3001}` // 3001 = `npm start` port
        : process.env.BASE_URL,
    // Public address for links in emails.
    HOST_BASE_URL: process.env.HOST_BASE_URL || process.env.BASE_URL,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_UPLOAD_PRESET: process.env.CLOUDINARY_UPLOAD_PRESET,
    GOOGLE_ANALYTICS_MEASUREMENT_ID:
      process.env.GOOGLE_ANALYTICS_MEASUREMENT_ID,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    qualities: [75, 100],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
