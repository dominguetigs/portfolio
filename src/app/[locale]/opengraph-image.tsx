import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { ImageResponse } from 'next/og';
import sharp from 'sharp';

import { CONTACT_INFO, SITE_URL } from '@/constants';
import { routing } from '@/i18n/routing';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/jpeg';

const PAPER = '#f1dfbe';
const INK = '#61450f';
const OLIVE = '#767b3a';
const MUTED = '#805f30';

// Read straight from the JSON: generateImageMetadata runs like
// generateStaticParams, where next-intl cannot resolve the locale yet.
async function getMessages(locale: string) {
  const safeLocale = (routing.locales as readonly string[]).includes(locale)
    ? locale
    : routing.defaultLocale;
  return (await import(`../../../messages/${safeLocale}.json`)).default;
}

function toDataUri(file: Buffer) {
  return `data:image/png;base64,${file.toString('base64')}`;
}

export async function generateImageMetadata({
  params,
}: {
  params: { locale: string };
}) {
  const messages = await getMessages(params.locale);
  return [{ id: 'card', alt: messages.Metadata.ogAlt, size, contentType }];
}

/**
 * The link preview: the hero over the day painting, in each language. Rendered
 * by next/og (PNG, about 1 MB with the painting) and served as a JPEG of about
 * 60 KB, small enough for WhatsApp to show it.
 */
export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages(locale);

  const [painting, portrait, nunito] = await Promise.all([
    readFile(join(process.cwd(), 'public', 'bg-light.png')).then(toDataUri),
    readFile(join(process.cwd(), 'public', 'hero-profile.png')).then(toDataUri),
    readFile(
      join(process.cwd(), 'assets', 'fonts', 'nunito-latin-700-normal.woff'),
    ),
  ]);

  const png = new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          background: PAPER,
          fontFamily: 'Nunito',
        }}
      >
        <img
          src={painting}
          alt=""
          width={1200}
          height={800}
          style={{
            position: 'absolute',
            top: -60,
            left: 0,
            width: 1200,
            height: 800,
            objectFit: 'cover',
            opacity: 0.5,
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            backgroundImage: `linear-gradient(to top, ${PAPER} 8%, rgba(241,223,190,0.35) 55%, rgba(241,223,190,0) 100%)`,
          }}
        />

        <div
          style={{
            position: 'relative',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src={portrait}
            alt=""
            width={210}
            height={210}
            style={{
              borderRadius: 9999,
              border: '6px solid rgba(163,168,94,0.45)',
              marginBottom: 28,
            }}
          />
          <div style={{ fontSize: 76, color: INK, lineHeight: 1.05 }}>
            {CONTACT_INFO.name}
          </div>
          <div style={{ fontSize: 38, color: OLIVE, marginTop: 14 }}>
            {messages.Index.Hero.titles.main}
          </div>
          <div style={{ fontSize: 24, color: MUTED, marginTop: 40 }}>
            {new URL(SITE_URL).host}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: 'Nunito', data: nunito, weight: 700, style: 'normal' }],
    },
  );

  const jpeg = await sharp(Buffer.from(await png.arrayBuffer()))
    .jpeg({ quality: 85, mozjpeg: true })
    .toBuffer();

  return new Response(new Uint8Array(jpeg), {
    headers: { 'Content-Type': contentType },
  });
}
