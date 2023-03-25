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
};

// crtl + ` => toggle terminal
// 執行 yarn run dev 前，請記得有無 yarn install

// !!! https://nextjs.org/docs/advanced-features/compiler
/* 
experimental:{
    appDir: true,
  } 
*/
