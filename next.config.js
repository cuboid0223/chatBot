/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  env: {
    SPEECH_KEY: process.env.SPEECH_KEY,
    SPEECH_REGION: process.env.SPEECH_REGION,
  },
  experimental: {
    appDir: true, // 允許 app 資料夾的存在？
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "links.papareact.com",
        port: "",
      },
    ],
  },

  webpack(config, options) {
    const { isServer } = options;
    // fs import in next.js    https://stackoverflow.com/questions/64361940/webpack-error-configuration-node-has-an-unknown-property-fs
    if (!isServer) {
      config.resolve.fallback.fs = false;
    }
    // import mp3 in next.js   https://github.com/vercel/next.js/discussions/12810
    config.module.rules.push({
      test: /\.(ogg|mp3|wav|mpe?g)$/i,
      exclude: config.exclude,
      use: [
        {
          loader: require.resolve("url-loader"),
          options: {
            limit: config.inlineImageLimit,
            fallback: require.resolve("file-loader"),
            publicPath: `${config.assetPrefix}/_next/static/images/`,
            outputPath: `${isServer ? "../" : ""}static/images/`,
            name: "[name]-[hash].[ext]",
            esModule: config.esModule || false,
          },
        },
      ],
    });
    return config;
  },
};

// crtl + ` => toggle terminal
// 執行 yarn run dev 前，請記得有無 yarn install

// !!! https://nextjs.org/docs/advanced-features/compiler
/* 
experimental:{
    appDir: true,
  } 
*/
