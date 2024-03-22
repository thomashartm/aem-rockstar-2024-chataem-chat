/** @type {import('next').NextConfig} */
module.exports = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',

})
module.exports = {
  images: {
    unoptimized: true,
  },

}
