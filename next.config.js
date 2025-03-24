/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Improve development performance
  swcMinify: true,
  
  // Reduce memory usage during builds
  onDemandEntries: {
    // Period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 15 * 1000,
    // Number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
  
  // Disable unused features to save memory
  images: {
    disableStaticImages: false, // Set to true if you don't use static images
  },
}

module.exports = nextConfig 