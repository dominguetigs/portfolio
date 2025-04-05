import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['192.168.15.2'],

  /* config options here */
};

export default withNextIntl(nextConfig);
