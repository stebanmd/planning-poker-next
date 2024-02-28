/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  redirects: () => {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: true,
      }
    ]
  }
};

export default nextConfig;
