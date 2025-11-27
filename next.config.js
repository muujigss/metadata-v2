/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  env: {
    BASE_URL:
      process.env.NODE_ENV == "production"
        ? process.env.HOST_BASE_URL
        : process.env.BASE_URL,
    DATABASE_URL: process.env.DATABASE_URL,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_UPLOAD_PRESET: process.env.CLOUDINARY_UPLOAD_PRESET,
    GOOGLE_ANALYTICS_MEASUREMENT_ID:
      process.env.GOOGLE_ANALYTICS_MEASUREMENT_ID,
    JWT_SECRET: process.env.JWT_SECRET,
    METADATA_INFO_EMAIL: process.env.METADATA_INFO_EMAIL,
    METADATA_INFO_PASSWORD: process.env.METADATA_INFO_PASSWORD,
    ELASTIC_URL: process.env.ELASTIC_URL,
    ELASTIC_USER: process.env.ELASTIC_USER,
    ELASTIC_PASSWORD: process.env.ELASTIC_PASSWORD,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        // pathname: "/account123/**",
        pathname: "/djv1wgfyh/image/upload/**",
      },
    ],
  },
};

module.exports = nextConfig;
