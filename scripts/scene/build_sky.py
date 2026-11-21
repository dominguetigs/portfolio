"""Build the real sky the night painting shows (phase 3, D-013; D-018).

    python3 scripts/scene/build_sky.py <folder>

The folder holds heasarc_bsc5p.tdat.gz, not kept in the repo: the Yale Bright
Star Catalogue, 5th revised edition (Hoffleit & Warren 1991), as NASA's
HEASARC distributes it (a U.S. Government work), from
https://heasarc.gsfc.nasa.gov/FTP/heasarc/dbase/tdat_files/heasarc_bsc5p.tdat.gz

Writes:
- src/scene/sky.json            the stars the painting can show (the southern
                                sky: it looks south from São Paulo)
- src/scene/assets/milkyway.webp  the Milky Way (modelled along the galactic
                                plane) and the Magellanic Clouds, as a
                                brightness map in right ascension and
                                declination (equirectangular)
"""

import gzip
import json
import math
import os
import sys

import numpy as np
from PIL import Image
from scipy import ndimage as ndi

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))

# The painting looks south from São Paulo (latitude -23.55) up to about 59°
# above the horizon: even at its widest it shows nothing north of about -30°.
# A margin keeps stars that sit just outside the frame for wide screens.
MAX_DEC = -18.0
MAG_LIMIT = 5.8
# Components closer than this (degrees, well under a pixel) are one star.
MERGE = 0.05


def load_catalogue(path):
    """The Bright Star Catalogue's stars: position (J2000), V magnitude, B-V."""
    opener = gzip.open if path.endswith('.gz') else open
    with opener(path, 'rt', encoding='latin-1') as fh:
        lines = fh.read().split('\n')
    fields = next(l for l in lines if l.startswith('line[1]')).split('=')[1].split()
    col = {f: i for i, f in enumerate(fields)}
    stars = []
    for line in lines[lines.index('<DATA>') + 1:]:
        row = line.split('|')
        if len(row) < len(fields) or not row[col['vmag']] or not row[col['ra']]:
            continue  # the header's end, and the few entries that are not stars
        stars.append({
            'ra': float(row[col['ra']]),
            'dec': float(row[col['dec']]),
            'mag': float(row[col['vmag']]),
            'bv': float(row[col['bv_color']]) if row[col['bv_color']] else 0.6,
        })
    return stars


def separation(a, b):
    ra0, dec0, ra1, dec1 = map(math.radians, (a['ra'], a['dec'], b['ra'], b['dec']))
    c = math.sin(dec0) * math.sin(dec1) + math.cos(dec0) * math.cos(dec1) * math.cos(ra0 - ra1)
    return math.degrees(math.acos(max(-1.0, min(1.0, c))))


def merge_close(stars):
    """Close doubles (α Centauri, Acrux) as one star with their summed light,
    where the brighter one is (the catalogue lists their components)."""
    out, cells = [], {}
    for s in sorted(stars, key=lambda s: s['mag']):
        cell = (int(s['dec'] // 1), int(s['ra'] // 1))
        near = next((o for dy in (-1, 0, 1) for dx in (-1, 0, 1)
                     for o in cells.get((cell[0] + dy, (cell[1] + dx) % 360), [])
                     if separation(o, s) < MERGE), None)
        if near:
            near['flux'] += 10 ** (-0.4 * s['mag'])
            continue
        s = dict(s, flux=10 ** (-0.4 * s['mag']))
        cells.setdefault(cell, []).append(s)
        out.append(s)
    for s in out:
        s['mag'] = round(-2.5 * math.log10(s['flux']), 2)
    return out


def bv_to_rgb(bv):
    """A star's colour from its B-V index, kept soft (the painting is soft)."""
    bv = max(-0.4, min(2.0, bv))
    t = (bv + 0.4) / 2.4
    stops = [(0.0, (0.72, 0.82, 1.0)), (0.3, (0.92, 0.95, 1.0)), (0.55, (1.0, 0.97, 0.9)),
             (0.8, (1.0, 0.86, 0.68)), (1.0, (1.0, 0.75, 0.55))]
    for (t0, c0), (t1, c1) in zip(stops, stops[1:]):
        if t <= t1:
            k = (t - t0) / (t1 - t0)
            return [round(a + (b - a) * k, 3) for a, b in zip(c0, c1)]
    return list(stops[-1][1])


def main():
    catalogue = load_catalogue(os.path.join(sys.argv[1], 'heasarc_bsc5p.tdat.gz'))
    merged = merge_close([s for s in catalogue if s['dec'] <= MAX_DEC + 1])
    shown = sorted((s for s in merged if s['dec'] <= MAX_DEC and s['mag'] <= MAG_LIMIT), key=lambda s: s['ra'])

    sky = {
        'source': 'Yale Bright Star Catalogue, 5th ed. (Hoffleit & Warren 1991), via NASA HEASARC: '
                  'see THIRD_PARTY_NOTICES.md (served at /third-party-notices.txt).',
        # One row per star: ra, dec (degrees, J2000), magnitude, r, g, b.
        'stars': [[round(s['ra'], 4), round(s['dec'], 4), s['mag'], *bv_to_rgb(s['bv'])] for s in shown],
    }
    path = os.path.join(ROOT, 'src', 'scene', 'sky.json')
    with open(path, 'w', encoding='utf-8') as fh:
        json.dump(sky, fh, ensure_ascii=False, separators=(',', ':'))
    print(f'{len(shown)} stars, {os.path.getsize(path) // 1024} KB')

    build_milky_way()


def galactic(ra, dec):
    """Galactic longitude and latitude (degrees) of J2000 positions."""
    a, d = np.radians(ra), np.radians(dec)
    ag, dg, lncp = np.radians(192.85948), np.radians(27.12825), np.radians(122.93192)
    sin_b = np.sin(d) * np.sin(dg) + np.cos(d) * np.cos(dg) * np.cos(a - ag)
    b = np.arcsin(np.clip(sin_b, -1, 1))
    l = lncp - np.arctan2(np.cos(d) * np.sin(a - ag), np.sin(d) * np.cos(dg) - np.cos(d) * np.sin(dg) * np.cos(a - ag))
    return np.degrees(l) % 360, np.degrees(b)


def fbm(x, y, octaves=4, seed=7):
    """Smooth value noise, for the Milky Way's clumps."""
    rng = np.random.default_rng(seed)
    out = np.zeros_like(x)
    amp, freq, total = 1.0, 1.0, 0.0
    for _ in range(octaves):
        grid = rng.random((64, 64)).astype(np.float32)
        gx, gy = (x * freq) % 64, (y * freq) % 64
        out += amp * ndi.map_coordinates(grid, [gy, gx], order=1, mode='wrap')
        total += amp
        amp *= 0.5
        freq *= 2.0
    return out / total


def build_milky_way(w=1024, h=512):
    """The Milky Way (a band along the galactic plane: wider and brighter
    towards the centre in Sagittarius and through Carina, Crux and Centaurus,
    with the Coalsack and the Great Rift dark, clumped by noise) and the two
    Magellanic Clouds, as a brightness map: x = right ascension 0..360,
    y = declination +90 (top) .. -90 (bottom)."""
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    ra = (xx + 0.5) / w * 360.0
    dec = 90.0 - (yy + 0.5) / h * 180.0
    l, b = galactic(ra, dec)
    dl = lambda l0: (l - l0 + 180) % 360 - 180

    width = 5.5 + 6.0 * np.exp(-(dl(0) / 40) ** 2) + 2.0 * np.exp(-(dl(295) / 30) ** 2)
    glow = 0.35 + 0.65 * np.exp(-(dl(0) / 38) ** 2) + 0.4 * np.exp(-(dl(290) / 28) ** 2)
    band = np.exp(-(b / width) ** 2) * glow
    clumps = fbm(l / 6.0, (b + 90) / 6.0)
    band *= 0.55 + 0.9 * clumps
    coalsack = np.exp(-((dl(301.0)) ** 2 + (b + 1.0) ** 2) / (2 * 2.2 ** 2))
    rift = np.exp(-((b - 1.5) / 1.8) ** 2) * np.exp(-(dl(25) / 35) ** 2)
    band *= 1 - 0.75 * coalsack - 0.5 * rift

    canvas = band
    for ra0, dec0, sx, sy, strength in ((80.89, -69.76, 5.0, 4.0, 0.8), (13.19, -72.83, 2.6, 1.8, 0.6)):
        # Angular distance on the sphere, stretched into an ellipse.
        d_ra = ((ra - ra0 + 180) % 360 - 180) * np.cos(np.radians(dec0))
        d_dec = dec - dec0
        canvas = canvas + strength * np.exp(-((d_ra / sx) ** 2 + (d_dec / sy) ** 2)) * (0.7 + 0.6 * clumps)
    canvas = np.clip(canvas, 0, 1)
    path = os.path.join(ROOT, 'src', 'scene', 'assets', 'milkyway.webp')
    Image.fromarray((canvas * 255 + 0.5).astype(np.uint8), 'L').convert('RGB').save(path, 'WEBP', quality=80, method=6)
    print('milky way map', os.path.getsize(path) // 1024, 'KB')


if __name__ == '__main__':
    main()
