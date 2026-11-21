'use client';

import Image from 'next/image';

import { useTranslations } from 'next-intl';

import { motion } from 'motion/react';

import {
  ExternalLink,
  Globe2,
  LayoutDashboard,
  Lock,
  MessageCircle,
  Sparkles,
  Spline,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';

import { FEATURED_PROJECT } from './constants';

const HIGHLIGHT_ICONS = {
  knit: Sparkles,
  thread: Spline,
  globe: Globe2,
  whatsapp: MessageCircle,
} as const;

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
};

/**
 * The latest work, shown above the tabs: Ladôme's site first (its cover, the
 * rest is on the site itself), then its panel.
 */
export function FeaturedProject() {
  const t = useTranslations('Index.Projects.featured');
  const { site, cms, cover, phone, year, technologies } = FEATURED_PROJECT;

  return (
    <motion.article
      {...reveal}
      className="mb-12 overflow-hidden rounded-xl border bg-card shadow-sm"
    >
      {/* The site, framed as a browser window */}
      <div className="border-b bg-muted/40">
        <div className="flex items-center gap-2 px-4 py-2 border-b">
          <span className="flex gap-1.5" aria-hidden="true">
            <span className="size-2.5 rounded-full bg-[#ff5f57]" />
            <span className="size-2.5 rounded-full bg-[#febc2e]" />
            <span className="size-2.5 rounded-full bg-[#28c840]" />
          </span>
          <span className="mx-auto max-w-[70%] truncate rounded-md bg-background/70 px-3 py-0.5 text-xs text-muted-foreground">
            {new URL(site).host}
          </span>
        </div>

        <a
          href={site}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t('visitSite')}
          className="group relative block aspect-[16/10] overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
        >
          <Image
            src={cover}
            alt={t('images.cover')}
            fill
            sizes="(max-width: 896px) 100vw, 864px"
            className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.02]"
          />

          <div className="absolute bottom-3 right-3 w-[17%] min-w-16 max-w-28 overflow-hidden rounded-[0.9rem] border-[3px] border-foreground/80 shadow-lg sm:bottom-5 sm:right-5">
            <Image
              src={phone.src}
              alt={t('images.phone')}
              width={phone.width}
              height={phone.height}
              sizes="112px"
              className="h-auto w-full"
            />
          </div>
        </a>
      </div>

      <div className="space-y-6 p-5 sm:p-7">
        <header className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{t('label')}</Badge>
            <span className="text-xs text-muted-foreground">{year}</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold">{t('title')}</h3>
          <p className="text-primary font-medium">{t('subtitle')}</p>
          <p className="text-muted-foreground">{t('description')}</p>
        </header>

        <section className="space-y-3">
          <h4 className="text-sm uppercase tracking-wider text-muted-foreground">
            {t('siteTitle')}
          </h4>
          <ul className="grid gap-3 sm:grid-cols-2">
            {(
              Object.keys(HIGHLIGHT_ICONS) as (keyof typeof HIGHLIGHT_ICONS)[]
            ).map(key => {
              const Icon = HIGHLIGHT_ICONS[key];
              return (
                <li
                  key={key}
                  className="flex gap-3 rounded-lg border bg-background/40 p-3"
                >
                  <Icon
                    className="mt-0.5 size-5 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  <div className="space-y-1">
                    <p className="font-semibold leading-snug">
                      {t(`highlights.${key}.title`)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t(`highlights.${key}.text`)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="flex flex-col gap-4 rounded-lg border bg-background/40 p-3 sm:flex-row sm:items-center">
          <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-md border sm:w-48">
            <Image
              src={cms.image}
              alt={t('images.cms')}
              fill
              sizes="(max-width: 640px) 100vw, 192px"
              className="object-cover"
            />
          </div>
          <div className="space-y-1">
            <p className="flex items-center gap-2 font-semibold">
              <LayoutDashboard
                className="size-4 text-primary"
                aria-hidden="true"
              />
              {t('cmsTitle')}
            </p>
            <p className="text-sm text-muted-foreground">{t('cmsText')}</p>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Lock className="size-3" aria-hidden="true" />
              {t('cmsNote')}
            </p>
          </div>
        </section>

        <div className="flex flex-wrap gap-1">
          {technologies.map(tech => (
            <Badge key={tech} variant="secondary">
              {tech}
            </Badge>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <a
            href={site}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-primary-foreground shadow-primary transition-colors hover:bg-primary/90"
          >
            {t('visitSite')}
            <ExternalLink className="size-3.5" aria-hidden="true" />
          </a>
          <a
            href={cms.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border bg-card px-5 py-2.5 transition-colors hover:bg-accent"
          >
            {t('visitCms')}
            <ExternalLink className="size-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </motion.article>
  );
}
