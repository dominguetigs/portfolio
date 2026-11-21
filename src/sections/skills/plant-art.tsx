'use client';

import { motion, type Variants } from 'motion/react';

/**
 * The garden's plants, painted in SVG (viewBox 0 0 100 120, rooted at
 * 50,118). Each part grows in when its bed is shown: the stem draws upward,
 * then the leaves unfold and the flowers open (variants `hidden` / `grown`,
 * set by the bed). Colours are the garden tokens (globals.css), so they
 * follow the theme's sunset.
 */
export type PlantKind =
  | 'herb'
  | 'daisy'
  | 'sunflower'
  | 'lettuce'
  | 'tomato'
  | 'wheat'
  | 'seedling';

const C = {
  leaf: 'var(--garden-leaf)',
  leafLight: 'var(--garden-leaf-light)',
  leafDark: 'var(--garden-leaf-dark)',
  stem: 'var(--garden-stem)',
  petal: 'var(--garden-petal)',
  petalShade: 'var(--garden-petal-shade)',
  yellow: 'var(--garden-yellow)',
  orange: 'var(--garden-orange)',
  red: 'var(--garden-red)',
  brown: 'var(--garden-brown)',
};

/** Server and browser trigonometry can differ in the last digit. */
const round = (v: number) => Math.round(v * 100) / 100;

// (Hidden, a stem would still show its round cap as a dot.)
const grow = (delay: number, duration = 0.7): Variants => ({
  hidden: { pathLength: 0, opacity: 0 },
  grown: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration, delay, ease: 'easeOut' },
      opacity: { duration: 0.01, delay },
    },
  },
});

const unfold = (delay: number): Variants => ({
  hidden: { scale: 0 },
  grown: {
    scale: 1,
    transition: { type: 'spring', stiffness: 170, damping: 13, delay },
  },
});

const bloom = (delay: number): Variants => ({
  hidden: { scale: 0, rotate: -40 },
  grown: {
    scale: 1,
    rotate: 0,
    transition: { type: 'spring', stiffness: 120, damping: 11, delay },
  },
});

function Stem({
  d,
  width = 3,
  delay,
  color = C.stem,
}: {
  d: string;
  width?: number;
  delay: number;
  color?: string;
}) {
  return (
    <motion.path
      d={d}
      variants={grow(delay)}
      style={{
        fill: 'none',
        stroke: color,
        strokeWidth: width,
        strokeLinecap: 'round',
      }}
    />
  );
}

/** A leaf from its stalk at x, y, pointing `angle` degrees (0: right). */
function Leaf({
  x,
  y,
  angle,
  length,
  width,
  delay,
  light = false,
}: {
  x: number;
  y: number;
  angle: number;
  length: number;
  width: number;
  delay: number;
  light?: boolean;
}) {
  const l = length;
  const w = width;
  const blade = `M0 0C${l * 0.3} ${-w} ${l * 0.72} ${-w * 0.85} ${l} 0C${l * 0.72} ${w * 0.85} ${l * 0.3} ${w} 0 0Z`;
  // The side that catches the light, washed lighter.
  const lit = `M0 0C${l * 0.3} ${-w} ${l * 0.72} ${-w * 0.85} ${l} 0C${l * 0.62} ${-w * 0.18} ${l * 0.3} ${-w * 0.12} 0 0Z`;
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle})`}>
      <motion.g variants={unfold(delay)} style={{ originX: 0, originY: 0.5 }}>
        <path d={blade} style={{ fill: light ? C.leafLight : C.leaf }} />
        <path
          d={lit}
          style={{ fill: C.leafLight, opacity: light ? 0.9 : 0.65 }}
        />
        <path
          d={`M1 0Q${l * 0.5} ${-w * 0.1} ${l * 0.84} 0`}
          style={{
            fill: 'none',
            stroke: C.leafDark,
            strokeWidth: 0.8,
            opacity: 0.55,
          }}
        />
      </motion.g>
    </g>
  );
}

function Herb({ delay }: { delay: number }) {
  return (
    <>
      <Stem d="M50 118C49 98 52 74 50 44" delay={delay} />
      <Leaf
        x={50}
        y={100}
        angle={-28}
        length={26}
        width={10}
        delay={delay + 0.35}
      />
      <Leaf
        x={50}
        y={100}
        angle={-152}
        length={25}
        width={10}
        delay={delay + 0.4}
      />
      <Leaf
        x={50.5}
        y={82}
        angle={-36}
        length={22}
        width={9}
        delay={delay + 0.48}
      />
      <Leaf
        x={50.5}
        y={82}
        angle={-146}
        length={21}
        width={9}
        delay={delay + 0.52}
      />
      <Leaf
        x={50.6}
        y={64}
        angle={-42}
        length={17}
        width={7.5}
        delay={delay + 0.6}
        light
      />
      <Leaf
        x={50.6}
        y={64}
        angle={-138}
        length={17}
        width={7.5}
        delay={delay + 0.64}
        light
      />
      <Leaf
        x={50}
        y={46}
        angle={-66}
        length={11}
        width={5}
        delay={delay + 0.72}
        light
      />
      <Leaf
        x={50}
        y={46}
        angle={-114}
        length={11}
        width={5}
        delay={delay + 0.75}
        light
      />
    </>
  );
}

function Daisy({ delay }: { delay: number }) {
  const petals = Array.from({ length: 12 }, (_, i) => i * 30);
  return (
    <>
      <Stem d="M50 118C51 96 48 70 50 38" width={2.4} delay={delay} />
      <Leaf
        x={50.5}
        y={104}
        angle={-24}
        length={24}
        width={7}
        delay={delay + 0.35}
      />
      <Leaf
        x={49.5}
        y={90}
        angle={-158}
        length={21}
        width={6.5}
        delay={delay + 0.42}
      />
      <g transform="translate(50 36)">
        <motion.g variants={bloom(delay + 0.6)}>
          {petals.map(a => (
            <ellipse
              key={a}
              cx={0}
              cy={-10.5}
              rx={3.3}
              ry={9.5}
              transform={`rotate(${a})`}
              style={{
                fill: C.petal,
                stroke: C.petalShade,
                strokeWidth: 0.7,
              }}
            />
          ))}
          <circle r={5.8} style={{ fill: C.yellow }} />
          <circle
            cx={1.4}
            cy={1.6}
            r={3.4}
            style={{ fill: C.orange, opacity: 0.45 }}
          />
        </motion.g>
      </g>
    </>
  );
}

function Sunflower({ delay }: { delay: number }) {
  const petals = Array.from({ length: 16 }, (_, i) => i * 22.5);
  return (
    <>
      <Stem d="M50 118C52 92 47 62 50 32" width={3.4} delay={delay} />
      <Leaf
        x={51}
        y={100}
        angle={-18}
        length={30}
        width={12}
        delay={delay + 0.35}
      />
      <Leaf
        x={49.5}
        y={86}
        angle={-162}
        length={28}
        width={11}
        delay={delay + 0.42}
      />
      <Leaf
        x={49.8}
        y={64}
        angle={-32}
        length={20}
        width={8}
        delay={delay + 0.5}
        light
      />
      <g transform="translate(50 30)">
        <motion.g variants={bloom(delay + 0.62)}>
          {petals.map(a => (
            <path
              key={a}
              d="M0 -8C3.4 -13 2.6 -19 0 -23.5C-2.6 -19 -3.4 -13 0 -8Z"
              transform={`rotate(${a})`}
              style={{ fill: C.yellow, stroke: C.orange, strokeWidth: 0.6 }}
            />
          ))}
          <circle r={9.5} style={{ fill: C.brown }} />
          <circle
            cx={-2}
            cy={-2.2}
            r={5.5}
            style={{ fill: C.orange, opacity: 0.35 }}
          />
          {[0, 60, 120, 180, 240, 300].map(a => (
            <circle
              key={a}
              cx={round(5.4 * Math.cos((a * Math.PI) / 180))}
              cy={round(5.4 * Math.sin((a * Math.PI) / 180))}
              r={0.9}
              style={{ fill: C.yellow, opacity: 0.55 }}
            />
          ))}
        </motion.g>
      </g>
    </>
  );
}

function Lettuce({ delay }: { delay: number }) {
  const leaves = [
    { a: -170, l: 30, w: 12 },
    { a: -18, l: 30, w: 12 },
    { a: -146, l: 36, w: 15 },
    { a: -40, l: 36, w: 15 },
    { a: -122, l: 38, w: 16 },
    { a: -62, l: 38, w: 16 },
    { a: -92, l: 34, w: 15 },
  ];
  return (
    <>
      {leaves.map((leaf, i) => (
        <Leaf
          key={leaf.a}
          x={50}
          y={115}
          angle={leaf.a}
          length={leaf.l}
          width={leaf.w}
          delay={delay + 0.1 + i * 0.07}
          light={i % 2 === 1}
        />
      ))}
      <Leaf
        x={50}
        y={114}
        angle={-104}
        length={20}
        width={9}
        delay={delay + 0.7}
        light
      />
      <Leaf
        x={50}
        y={114}
        angle={-78}
        length={20}
        width={9}
        delay={delay + 0.74}
        light
      />
    </>
  );
}

function Tomato({ delay }: { delay: number }) {
  const fruits = [
    { x: 67, y: 78, r: 6.2, d: 0.85 },
    { x: 34, y: 64, r: 5.6, d: 0.95 },
    { x: 57, y: 52, r: 5, d: 1.05 },
  ];
  return (
    <>
      <Stem d="M50 118C50 96 54 72 49 44" delay={delay} />
      <Stem d="M50.6 92Q60 84 66 72" width={2} delay={delay + 0.3} />
      <Stem d="M51.3 76Q41 68 34 58" width={2} delay={delay + 0.35} />
      <Leaf
        x={66}
        y={73}
        angle={-30}
        length={15}
        width={6}
        delay={delay + 0.55}
      />
      <Leaf
        x={58}
        y={84}
        angle={-110}
        length={12}
        width={5}
        delay={delay + 0.58}
        light
      />
      <Leaf
        x={34}
        y={59}
        angle={-150}
        length={15}
        width={6}
        delay={delay + 0.6}
      />
      <Leaf
        x={42}
        y={68}
        angle={-70}
        length={12}
        width={5}
        delay={delay + 0.62}
        light
      />
      <Leaf
        x={49}
        y={46}
        angle={-60}
        length={14}
        width={6}
        delay={delay + 0.66}
        light
      />
      <Leaf
        x={49}
        y={46}
        angle={-130}
        length={13}
        width={5.5}
        delay={delay + 0.68}
      />
      <Leaf
        x={50}
        y={104}
        angle={-160}
        length={18}
        width={7}
        delay={delay + 0.45}
      />
      {fruits.map(f => (
        <g key={f.x} transform={`translate(${f.x} ${f.y})`}>
          <motion.g variants={unfold(delay + f.d)}>
            <circle r={f.r} style={{ fill: C.red }} />
            <ellipse
              cx={-f.r * 0.35}
              cy={-f.r * 0.35}
              rx={f.r * 0.32}
              ry={f.r * 0.22}
              style={{ fill: C.petal, opacity: 0.55 }}
            />
            <path
              d={`M0 ${-f.r}l-2.4 -1.6M0 ${-f.r}l2.4 -1.6M0 ${-f.r}l0 -2.6`}
              style={{
                stroke: C.leafDark,
                strokeWidth: 1.3,
                strokeLinecap: 'round',
              }}
            />
          </motion.g>
        </g>
      ))}
    </>
  );
}

function Wheat({ delay }: { delay: number }) {
  const blades = [
    { d: 'M50 118Q44 86 30 62', w: 2, c: C.leaf },
    { d: 'M50 118Q58 88 72 66', w: 2, c: C.leaf },
    { d: 'M50 118Q47 80 40 40', w: 1.8, c: C.leafLight },
    { d: 'M50 118Q53 78 60 36', w: 1.8, c: C.leafLight },
    { d: 'M50 118Q50 76 50 30', w: 1.8, c: C.stem },
  ];
  const heads = [
    { x: 40, y: 40, a: -14 },
    { x: 60, y: 36, a: 12 },
    { x: 50, y: 30, a: 0 },
  ];
  return (
    <>
      {blades.map((b, i) => (
        <Stem
          key={b.d}
          d={b.d}
          width={b.w}
          color={b.c}
          delay={delay + i * 0.06}
        />
      ))}
      {heads.map((h, i) => (
        <g key={h.x} transform={`translate(${h.x} ${h.y}) rotate(${h.a})`}>
          <motion.g
            variants={unfold(delay + 0.6 + i * 0.08)}
            style={{ originX: 0.5, originY: 1 }}
          >
            {[0, 1, 2, 3, 4].map(k => (
              <g key={k}>
                <ellipse
                  cx={-2.2}
                  cy={-3 - k * 4.2}
                  rx={1.9}
                  ry={3}
                  transform={`rotate(-22 ${-2.2} ${-3 - k * 4.2})`}
                  style={{ fill: C.yellow }}
                />
                <ellipse
                  cx={2.2}
                  cy={-5 - k * 4.2}
                  rx={1.9}
                  ry={3}
                  transform={`rotate(22 2.2 ${-5 - k * 4.2})`}
                  style={{ fill: C.orange, opacity: 0.85 }}
                />
              </g>
            ))}
          </motion.g>
        </g>
      ))}
    </>
  );
}

function Seedling({ delay }: { delay: number }) {
  return (
    <>
      <Stem d="M50 118Q49 108 51 96" width={2.4} delay={delay} />
      <Leaf
        x={51}
        y={97}
        angle={-24}
        length={15}
        width={8}
        delay={delay + 0.35}
        light
      />
      <Leaf
        x={51}
        y={97}
        angle={-156}
        length={15}
        width={8}
        delay={delay + 0.4}
      />
      <Leaf
        x={51}
        y={96}
        angle={-88}
        length={7}
        width={3.2}
        delay={delay + 0.55}
      />
    </>
  );
}

const ART: Record<PlantKind, (props: { delay: number }) => React.ReactNode> = {
  herb: Herb,
  daisy: Daisy,
  sunflower: Sunflower,
  lettuce: Lettuce,
  tomato: Tomato,
  wheat: Wheat,
  seedling: Seedling,
};

/** Each plant's frame, rooted at the bottom edge (the soil's top). */
const FRAME: Record<PlantKind, string> = {
  herb: '8 16 84 104',
  daisy: '8 16 84 104',
  sunflower: '8 16 84 104',
  lettuce: '8 40 84 80',
  tomato: '8 16 84 104',
  wheat: '8 16 84 104',
  seedling: '26 82 48 38',
};

export function PlantArt({ kind, delay }: { kind: PlantKind; delay: number }) {
  const Art = ART[kind];
  return (
    <svg
      viewBox={FRAME[kind]}
      aria-hidden="true"
      className="block h-full w-full overflow-visible"
    >
      <Art delay={delay} />
    </svg>
  );
}
