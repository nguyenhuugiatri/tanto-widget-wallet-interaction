const bundleAnalyzer = require("@next/bundle-analyzer")

const withBundleAnalyzer = bundleAnalyzer({
  enabled: false,
})

module.exports = withBundleAnalyzer({
  images: {
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox; style-src 'none",
  },
})
