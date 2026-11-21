import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Phones and other machines on the home network (any 192.168.x.y, so a new
  // DHCP address does not block the dev server's scripts again).
  allowedDevOrigins: ['192.168.*.*'],

  // `next dev` would write an AGENTS.md; its one rule lives in CLAUDE.md.
  agentRules: false,

  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

export default withNextIntl(nextConfig);
