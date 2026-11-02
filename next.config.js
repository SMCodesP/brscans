/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Sem acesso à Vercel pela CLI; este valor sobrepõe o env do painel no build.
  env:
    process.env.NODE_ENV === 'production'
      ? {
          NEXT_PUBLIC_API_URL:
            'https://3wzrvo9ltl.execute-api.sa-east-1.amazonaws.com/dev',
        }
      : {},
  images: {
    domains: ['s4.anilist.co'],
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

module.exports = nextConfig;
