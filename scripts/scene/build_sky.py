"""Build the real sky the night painting shows (phase 3).

    python3 scripts/scene/build_sky.py <d3-celestial>/data

The source is the data folder of the d3-celestial package (BSD-3-Clause,
(c) 2015 Olaf Frohn; stars from XHIP, names from the IAU, constellation lines
from the IAU pages, the Milky Way outline from J. R. Vieira). Download it with
`curl -L $(npm view d3-celestial dist.tarball) | tar -xz` into a scratch folder;
it is not kept in the repo.

Writes:
- src/scene/sky.json            the stars the painting can show (the southern
                                sky: it looks south from São Paulo), the
                                constellation lines, the bright stars' names
                                and the constellations' names in pt, en, es
- src/scene/assets/milkyway.webp  the Milky Way (modelled along the galactic
                                plane) and the Magellanic Clouds, as a
                                brightness map in right ascension and
                                declination (equirectangular)
"""

import json
import os
import sys

import numpy as np
from PIL import Image
from scipy import ndimage as ndi

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))

# The painting looks south from São Paulo (latitude -23.55) up to about 50°
# above the horizon: everything it can show lies south of declination -30°.
# A margin keeps stars that sit just outside the frame for wide screens.
MAX_DEC = -18.0
MAG_LIMIT = 5.8
NAME_MAG = 3.2

# The constellations of that sky, in Portuguese (the data has en and es).
PT_NAMES = {
    'Aps': 'Ave-do-Paraíso', 'Aqr': 'Aquário', 'Aql': 'Águia', 'Ara': 'Altar',
    'Cae': 'Buril', 'CMa': 'Cão Maior', 'Cap': 'Capricórnio', 'Car': 'Quilha',
    'Cen': 'Centauro', 'Cet': 'Baleia', 'Cha': 'Camaleão', 'Cir': 'Compasso',
    'Col': 'Pomba', 'CrA': 'Coroa Austral', 'Crt': 'Taça', 'Cru': 'Cruzeiro do Sul',
    'Crv': 'Corvo', 'Dor': 'Dourado', 'Eri': 'Erídano', 'For': 'Fornalha',
    'Gru': 'Grou', 'Hor': 'Relógio', 'Hya': 'Hidra', 'Hyi': 'Hidra Macho',
    'Ind': 'Índio', 'Lep': 'Lebre', 'Lib': 'Balança', 'Lup': 'Lobo',
    'Men': 'Mesa', 'Mic': 'Microscópio', 'Mus': 'Mosca', 'Nor': 'Esquadro',
    'Oct': 'Oitante', 'Oph': 'Ofiúco', 'Pav': 'Pavão', 'Phe': 'Fênix',
    'Pic': 'Pintor', 'PsA': 'Peixe Austral', 'Pup': 'Popa', 'Pyx': 'Bússola',
    'Ret': 'Retículo', 'Sgr': 'Sagitário', 'Sco': 'Escorpião', 'Scl': 'Escultor',
    'Ser': 'Serpente', 'Tel': 'Telescópio', 'TrA': 'Triângulo Austral',
    'Tuc': 'Tucano', 'Vel': 'Vela', 'Vol': 'Peixe Voador', 'Ant': 'Máquina Pneumática',
    'Mon': 'Unicórnio', 'Ori': 'Órion', 'Vir': 'Virgem', 'Sct': 'Escudo',
}


def ra_deg(lon):
    """d3-celestial stores right ascension as GeoJSON longitude (-180..180)."""
    return lon % 360.0


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
    data = sys.argv[1]
    load = lambda name: json.load(open(os.path.join(data, name), encoding='utf-8'))
    stars = load('stars.6.json')['features']
    names = load('starnames.json')
    constellations = {f['id']: f['properties'] for f in load('constellations.json')['features']}
    lines = load('constellations.lines.json')['features']

    out_stars = []
    index = {}
    for f in stars:
        lon, dec = f['geometry']['coordinates']
        mag = float(f['properties']['mag'])
        if dec > MAX_DEC or mag > MAG_LIMIT:
            continue
        hip = str(f['id'])
        try:
            bv = float(f['properties'].get('bv') or 0.6)
        except ValueError:
            bv = 0.6
        star = {'ra': round(ra_deg(lon), 4), 'dec': round(dec, 4), 'mag': round(mag, 2), 'rgb': bv_to_rgb(bv)}
        n = names.get(hip)
        if n and n.get('name') and mag <= NAME_MAG:
            star['name'] = n['name']
            if n.get('es') and n['es'] != n['name']:
                star['es'] = n['es']
        if n and n.get('c'):
            star['c'] = n['c']
        index[(round(ra_deg(lon), 2), round(dec, 2))] = len(out_stars)
        out_stars.append(star)

    # Constellation lines as pairs of points (ra, dec), for the constellations
    # that reach the southern sky.
    out_lines = {}
    used = set()
    for f in lines:
        segments = []
        for path in f['geometry']['coordinates']:
            for (l0, d0), (l1, d1) in zip(path, path[1:]):
                if min(d0, d1) > MAX_DEC + 5:
                    continue
                segments.append([round(ra_deg(l0), 3), round(d0, 3), round(ra_deg(l1), 3), round(d1, 3)])
        if segments:
            out_lines[f['id']] = segments
            used.add(f['id'])
    used |= {s['c'] for s in out_stars if 'c' in s and 'name' in s}

    out_constellations = {}
    for cid in sorted(used):
        p = constellations.get(cid)
        if not p:
            continue
        out_constellations[cid] = {
            'en': p.get('en') or p['name'],
            'es': p.get('es') or p['name'],
            'pt': PT_NAMES.get(cid, p['name']),
        }
    missing = sorted(c for c in out_constellations if c not in PT_NAMES)
    if missing:
        print('no Portuguese name for', missing)

    sky = {
        'source': 'Derived from d3-celestial 0.7.35 data, (c) 2015 Olaf Frohn, BSD-3-Clause: see THIRD_PARTY_NOTICES.md (served at /third-party-notices.txt)',
        # One row per star: ra, dec (degrees, J2000), magnitude, r, g, b.
        'stars': [[s['ra'], s['dec'], s['mag'], *s['rgb']] for s in out_stars],
        'names': {str(i): {k: s[k] for k in ('name', 'es', 'c') if k in s} for i, s in enumerate(out_stars) if 'name' in s},
        'constellationOf': {str(i): s['c'] for i, s in enumerate(out_stars) if 'c' in s and s['mag'] <= 4.5},
        'lines': out_lines,
        'constellations': out_constellations,
    }
    path = os.path.join(ROOT, 'src', 'scene', 'sky.json')
    with open(path, 'w', encoding='utf-8') as fh:
        json.dump(sky, fh, ensure_ascii=False, separators=(',', ':'))
    print(f'{len(out_stars)} stars, {len(sky["names"])} named, {len(out_lines)} constellations with lines, '
          f'{os.path.getsize(path) // 1024} KB')

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
