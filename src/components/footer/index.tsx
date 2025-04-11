'use client';

import { CopyrightMessage } from './copyright-message';

export function Footer() {
  return (
    <footer className="mt-20 mb-8 lg:mb-0 text-center text-sm text-muted-foreground">
      <CopyrightMessage />
    </footer>
  );
}
