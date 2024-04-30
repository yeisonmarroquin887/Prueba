import dotenv from 'dotenv';
dotenv.config();

const nextConfig = {
  reactStrictMode: true,
  env: {
    PG_URI: process.env.PG_URI,
    // Define otras variables de entorno según sea necesario
  },
};

export default nextConfig;

