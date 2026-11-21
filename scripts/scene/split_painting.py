"""Split the day and night paintings into the layers the living scene animates.

Run once when a painting changes (needs numpy, pillow and scipy):

    python3 scripts/scene/split_painting.py [--debug DIR]

For each painting (public/bg-light.png = day, public/bg-dark.png = night) it
writes to src/scene/assets/:

- <set>-base.webp    the painting itself, sun or moon included, with only its
                     drifting clouds taken out (the sky behind them filled from
                     the clear sky around); alpha = land, which hides what
                     moves behind the hills. One image, so the parallax can
                     never tear it.
- day-clouds.webp    the drifting clouds (RGBA), matted against that sky
- day-clouds-still.webp  the clouds that stay put (RGBA): in the day's base by
                     day, drawn relit by night. The night has no clouds of its
                     own: one set of clouds, so the switch never changes them.
- <set>-light.webp   the sun's or the moon's disc (RGBA), drawn only while it
                     moves (the sunset); at rest the painting shows its own.
                     Its glow is a radial profile in scene.json.
- <set>-behind.webp  the clean sky behind that disc, for the place it leaves
- <set>-data.webp    half size; R: a smooth depth (0 high in the sky .. 1 at
                     the bottom, no step at the horizon), G: grass mask

and src/scene/scene.json with the sprite boxes and image sizes (read by the
shader's uniforms).

The two paintings show the same valley but are not aligned pixel to pixel,
so each one gets its own masks.
"""

import argparse
import json
import os

import numpy as np
from PIL import Image
from scipy import ndimage as ndi

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
PUBLIC = os.path.join(ROOT, 'public')
# Imported by src/scene/living-sky.tsx: the build names each file by its
# content hash, so a browser or CDN never mixes an old layer with a new one.
OUT = os.path.join(ROOT, 'src', 'scene', 'assets')

SETS = {
    'day': {
        'src': 'bg-light.png',
        'light_radius': 280,
        'disc_radius': 98,
        'cloud_lift': 0.035,
    },
    'night': {
        'src': 'bg-dark.png',
        'light_radius': 190,
        'disc_radius': 125,
        'cloud_lift': 0.03,
    },
}


def load(name):
    return np.asarray(Image.open(os.path.join(PUBLIC, name)).convert('RGB')).astype(np.float32) / 255


def luma(a):
    return a[..., 0] * 0.2126 + a[..., 1] * 0.7152 + a[..., 2] * 0.0722


def keep_bottom_component(mask):
    """Land is what touches the bottom edge: drops the sun and stray blobs."""
    labels, _ = ndi.label(mask)
    # The last rows, not the last row: morphology erodes the image border.
    near_bottom = labels[-16:]
    bottom = np.unique(near_bottom[near_bottom > 0])
    return np.isin(labels, bottom)


def land_mask(img, which):
    h = img.shape[0]
    r, g, b = img[..., 0], img[..., 1], img[..., 2]
    ratio = g / (b + 1e-3)
    if which == 'day':
        raw = ratio > 1.12
    else:
        raw = (ratio > 0.6) & (luma(img) < 0.5)
    raw[: int(h * 0.45)] = False  # no land in the upper sky
    raw = ndi.binary_opening(raw, iterations=2)
    raw = ndi.binary_closing(raw, iterations=6)
    raw = keep_bottom_component(raw)
    raw = ndi.binary_fill_holes(raw)
    # Columns below the first land row are land too (no sky under the hills).
    first = np.where(raw.any(axis=0), raw.argmax(axis=0), h)
    rows = np.arange(h)[:, None]
    horizon = ndi.median_filter(first, size=9)
    return rows >= horizon[None, :], horizon


def fill_holes(img, known, sigmas=(12, 40, 120, 320)):
    """Normalized convolution: fill unknown pixels from the known ones around."""
    out = img.copy()
    filled = known.astype(np.float32)
    for s in sigmas:
        w = ndi.gaussian_filter(filled, s)
        for c in range(3):
            num = ndi.gaussian_filter(out[..., c] * filled, s)
            est = num / np.maximum(w, 1e-6)
            out[..., c] = np.where(filled > 0.5, out[..., c], est)
        filled = np.maximum(filled, (w > 0.02).astype(np.float32))
    return out


def smooth_sky(img, mask, iterations=4):
    """A smooth gradient fitted to the sky: a low-order polynomial per channel,
    refitted without what stands out above it (clouds, stars, haze)."""
    h, w, _ = img.shape
    ys, xs = np.mgrid[0:h:4, 0:w:4].astype(np.float32)
    m = mask[::4, ::4]
    sub = img[::4, ::4]

    def features(x, y):
        x = x / w - 0.5
        y = y / h
        return np.stack([np.ones_like(x), x, y, x * x, x * y, y * y, y ** 3, x * y * y], -1)

    A = features(xs[m], ys[m])
    target = sub[m]
    keep = np.ones(len(A), bool)
    for _ in range(iterations):
        coef, *_ = np.linalg.lstsq(A[keep], target[keep], rcond=None)
        fitted = A @ coef
        keep = (luma(target) - luma(fitted)) < 0.01
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    return np.clip(features(xx, yy) @ coef, 0, 1).astype(np.float32)


def find_light(img):
    """The sun or the moon: the brightest blob in the upper half."""
    h = img.shape[0]
    v = img.max(-1)[: h // 2]
    t = np.percentile(v, 99.7)
    ys, xs = np.where(v >= t)
    return int(xs.mean()), int(ys.mean())


def save_rgba(rgb, alpha, path, quality=82, scale=1.0, exact=False):
    """exact keeps the colour under transparent pixels, which the encoder
    otherwise throws away (the base's sky is transparent: alpha is the land)."""
    a = np.dstack([rgb, alpha[..., None]])
    im = Image.fromarray(np.clip(a * 255 + 0.5, 0, 255).astype(np.uint8), 'RGBA')
    if scale != 1.0:
        im = im.resize((round(im.width * scale), round(im.height * scale)), Image.LANCZOS)
    im.save(path, 'WEBP', quality=quality, alpha_quality=90, method=6, exact=exact)


def save_rgb(rgb, path, quality=82):
    Image.fromarray(np.clip(rgb * 255 + 0.5, 0, 255).astype(np.uint8), 'RGB').save(
        path, 'WEBP', quality=quality, method=6
    )


def split(which, cfg, debug=None):
    img = load(cfg['src'])
    h, w, _ = img.shape
    yy, xx = np.mgrid[0:h, 0:w]

    land, horizon = land_mask(img, which)
    land_alpha = ndi.gaussian_filter(land.astype(np.float32), 1.2)

    # The light (sun or moon) and its glow.
    lx, ly = find_light(img)
    dist = np.hypot(xx - lx, yy - ly)
    light_zone = dist < cfg['light_radius']

    # Clouds are bright blobs on a smooth sky: a grey opening wider than any
    # cloud removes them and leaves the sky's gradient (a top-hat transform).
    # Worked at quarter size, for speed.
    sky = ~ndi.binary_dilation(land, iterations=6)
    small = luma(img)[::4, ::4].copy()
    small[~sky[::4, ::4]] = small[sky[::4, ::4]].max()  # land never reads as cloud
    base = ndi.grey_opening(small, size=(61, 61))
    base = ndi.gaussian_filter(base, 6)
    base = np.kron(base, np.ones((4, 4), np.float32))[:h, :w]
    lift = luma(img) - base

    # Around the light the glow is radially symmetric and the clouds are not:
    # there the baseline is the median brightness at each distance from it.
    radius = cfg['light_radius']
    rings = np.clip(dist, 0, radius * 1.3).astype(np.int32)
    lum = luma(img)
    count = int(radius * 1.3) + 1
    medians = np.array(
        ndi.median(lum, labels=np.where(sky, rings + 1, 0), index=np.arange(1, count + 1)),
        np.float32,
    )
    # A ring with no sky in it (all land) takes the one inside it.
    for r in range(count):
        if np.isnan(medians[r]):
            medians[r] = medians[r - 1] if r else lum.mean()
    profile = ndi.gaussian_filter1d(medians, 3)
    glow_lift = lum - profile[rings]
    blend = np.clip((dist - radius) / (radius * 0.3), 0, 1)
    lift = glow_lift * (1 - blend) + lift * blend

    # Clouds win over the light: the sun sits behind them.
    disc = dist < cfg['disc_radius']
    # The haze along the horizon is not a cloud: it stays in the base. If it
    # drifted, the clean sky behind it would show as a pale outline on the hills.
    # Whole clouds only: one that reaches down into the horizon band stays in
    # the base entirely, so no cloud is ever cut in two.
    # Specks (the frayed edge of the haze) stay too: they would drift as dots.
    # Clouds in the light's glow stay too: drifting, they would open holes in
    # it, and the glow is lit into them.
    near_land = ndi.binary_dilation(land, iterations=45)
    found = ndi.binary_opening(sky & ~disc & (lift > cfg['cloud_lift']), iterations=1)
    labels, count = ndi.label(found)
    grounded = np.unique(labels[near_land & (labels > 0)])
    glow_reach = dist < cfg['light_radius'] * 1.3
    glowing = np.unique(labels[glow_reach & (labels > 0)])
    sizes = ndi.sum(found, labels, index=np.arange(1, count + 1))
    specks = np.arange(1, count + 1)[sizes < 250]
    cloud = found & ~np.isin(labels, np.concatenate([grounded, glowing, specks]))
    cloud = ndi.binary_dilation(cloud, iterations=4) & ~ndi.binary_dilation(land, iterations=6)
    # The clouds both paintings share: every real cloud, not the haze along
    # the horizon (that is air, not a cloud, and it holds the treetops).
    every = found & ~np.isin(labels, grounded)
    every = ndi.binary_dilation(every, iterations=4) & ~ndi.binary_dilation(land, iterations=6)

    # The clean sky, filled from the clear sky around (used under the drifting
    # clouds, and around the sun or moon while it moves).
    clear = sky & ~cloud & ~light_zone
    plate = fill_holes(img, clear)
    # The sky with every cloud out. The day and the night share one set of
    # clouds, the day's (D-012): the night's sky is this, and the day's still
    # clouds are matted against it to be drawn, relit, by night.
    plate_all = fill_holes(img, sky & ~every & ~light_zone)
    if which == 'night':
        # The night's sky is a smooth fit of its painted sky (clouds, stars
        # and the moon's glow left out), with the painting itself only in a
        # band just above the horizon, which holds the treetops.
        reach_early = int(cfg['light_radius'] * 1.3)
        fit = smooth_sky(img, sky & ~ndi.binary_dilation(land, iterations=8) & (dist > reach_early))
        band = np.clip(1 - (horizon[None, :].astype(np.float32) - yy) / 50, 0, 1)
        plate = fit * (1 - band[..., None]) + img * band[..., None]

    # Matte the clouds and the light against the clean sky: alpha from how
    # much brighter the pixel is, colour unmixed so it composites back exactly.
    def matte(zone, gain, against):
        diff = np.clip(luma(img) - luma(against), 0, None)
        a = np.clip(diff * gain, 0, 1) * zone
        a = ndi.gaussian_filter(a, 0.8)
        safe = np.maximum(a, 1e-3)[..., None]
        col = np.clip((img - against * (1 - a[..., None])) / safe, 0, 1)
        # Where it is all but transparent the unmixed colour is noise: use the
        # sky's, which compresses and filters cleanly.
        col = np.where(a[..., None] < 0.03, against, col)
        return col, a

    cloud_zone = ndi.gaussian_filter(cloud.astype(np.float32), 2)
    cloud_rgb, cloud_a = matte(cloud_zone, 6.0, plate)
    still_zone = ndi.gaussian_filter((every & ~cloud).astype(np.float32), 2)
    still_rgb, still_a = matte(still_zone, 6.0, plate_all)

    # The sun or moon, for the sunset only (at rest the painting keeps its
    # own): its glow is radially symmetric, so it is measured as a profile,
    # the median brightness each ring adds over the clean sky (the median
    # ignores the clouds), fading to nothing at its reach. While it moves, the
    # shader subtracts that profile where the light was and adds it where it
    # is: exactly the painting when it starts, no edge, nothing cut.
    reach = int(cfg['light_radius'] * 1.3)
    rings = np.clip(dist, 0, reach).astype(np.int32)
    ring_labels = np.where(sky & ~land, rings + 1, 0)
    glow = np.zeros((reach + 1, 3), np.float32)
    for c in range(3):
        med = np.array(
            ndi.median(img[..., c] - plate[..., c], labels=ring_labels, index=np.arange(1, reach + 2)),
            np.float32,
        )
        for r in range(len(med)):
            if np.isnan(med[r]):
                med[r] = med[r - 1] if r else 0.0
        glow[:, c] = np.clip(ndi.gaussian_filter1d(med, 2), 0, None)
    radii = np.arange(reach + 1, dtype=np.float32)
    glow *= np.clip((reach - radii) / (reach * 0.25), 0, 1)[:, None] ** 2

    # The body (the disc itself) as a sprite, so the moon keeps its craters.
    glow_luma = glow @ np.array([0.2126, 0.7152, 0.0722], np.float32)
    body = int(np.argmax(glow_luma < glow_luma[0] * 0.5))
    body_a = np.clip((body + 4 - dist) / 8, 0, 1)
    light_rgb, light_a = img, body_a

    # The clean sky behind the disc, matched to the sky around it: the fill
    # from afar is offset by what the ring just outside the disc says (that
    # ring with the glow taken out), so the place the disc leaves has no edge.
    glow_here = glow[np.clip(dist, 0, reach).astype(np.int32)] * (dist < reach)[..., None]
    # (The ring starts past the disc's rim: the painted edge is not a perfect
    # circle, so the rim is covered by this sky too.)
    around = sky & ~land & (dist > body + 20) & (dist < body + 46)
    offset = fill_holes(img - glow_here - plate, around, sigmas=(6, 18, 50))
    behind = plate + offset

    # Depth: smooth all the way, rising from a little above the horizon to
    # the bottom. A step between sky and land would tear the warped painting.
    hz = horizon[None, :].astype(np.float32)
    rise = 90.0
    depth = np.clip((yy - (hz - rise)) / np.maximum(h - hz + rise, 1), 0, 1) ** 0.85
    depth = ndi.gaussian_filter(depth, 24)

    # Grass: the meadow, not the dark tree crowns, a little below the horizon.
    r, g, b = img[..., 0], img[..., 1], img[..., 2]
    if which == 'day':
        grassy = (g / (b + 1e-3) > 2.2) & (luma(img) > 0.22)
    else:
        grassy = (g / (b + 1e-3) > 0.72) & (luma(img) > 0.08)
    grass = land & grassy & (yy > hz + 25)
    grass = ndi.gaussian_filter(grass.astype(np.float32), 3)

    if which == 'day':
        # The base: the painting itself, sun included, with the clean sky only
        # under the drifting clouds (so they composite back exactly).
        moving = (cloud_zone > 0.001) & ~land
        base = np.where(moving[..., None], plate, img)
    else:
        # The night's base has no clouds of its own (the day's are drawn on it,
        # relit): its clean sky, the moon's glow and painted disc, its land.
        night_sky = np.clip(plate + glow_here, 0, 1)
        night_sky = night_sky * (1 - body_a[..., None]) + img * body_a[..., None]
        base = night_sky * (1 - land_alpha[..., None]) + img * land_alpha[..., None]

    os.makedirs(OUT, exist_ok=True)
    save_rgba(base, land_alpha, os.path.join(OUT, f'{which}-base.webp'), quality=84, exact=True)
    if which == 'day':
        # Clouds are soft: three quarters of the size is enough.
        save_rgba(cloud_rgb, cloud_a, os.path.join(OUT, 'day-clouds.webp'), quality=76, scale=0.75)
        save_rgba(still_rgb, still_a, os.path.join(OUT, 'day-clouds-still.webp'), quality=76, scale=0.75)

    # The light as a tight sprite.
    ys, xs = np.where(light_a > 0.01)
    x0, x1, y0, y1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
    save_rgba(light_rgb[y0:y1, x0:x1], light_a[y0:y1, x0:x1], os.path.join(OUT, f'{which}-light.webp'), quality=90)
    # The clean sky behind the disc, for the place it leaves (subtracting the
    # average glow would leave the moon's craters behind as a ghost).
    cover = body + 24
    bx0, by0 = max(lx - cover, 0), max(ly - cover, 0)
    bx1, by1 = min(lx + cover, w), min(ly + cover, h)
    save_rgb(behind[by0:by1, bx0:bx1], os.path.join(OUT, f'{which}-behind.webp'), quality=90)

    data = np.dstack([depth, grass, np.zeros_like(depth)])
    Image.fromarray(np.clip(data * 255 + 0.5, 0, 255).astype(np.uint8), 'RGB').resize(
        (w // 2, h // 2), Image.LANCZOS
    ).save(os.path.join(OUT, f'{which}-data.webp'), 'WEBP', quality=90, method=6)

    if debug:
        os.makedirs(debug, exist_ok=True)
        Image.fromarray((land * 255).astype(np.uint8)).save(os.path.join(debug, f'{which}-land-mask.png'))
        Image.fromarray((cloud * 255).astype(np.uint8)).save(os.path.join(debug, f'{which}-cloud-mask.png'))
        save_rgb(base, os.path.join(debug, f'{which}-base.webp'))
        Image.fromarray((depth * 255).astype(np.uint8)).save(os.path.join(debug, f'{which}-depth.png'))
        # Recomposite check at rest (day): base + clouds (hidden by the land)
        # must give the painting back. The night's own clouds are gone on
        # purpose, so it is checked by eye.
        sky_open = (1 - land_alpha)[..., None]
        comp = base * (1 - cloud_a[..., None] * sky_open) + cloud_rgb * cloud_a[..., None] * sky_open
        if which == 'night':
            comp = img
        save_rgb(comp, os.path.join(debug, f'{which}-recomposite.webp'))
        err = np.abs(comp - img).mean()
        print(f'{which}: recomposite mean abs error {err:.4f}')

    extras = {'base': base, 'land_alpha': land_alpha, 'light': (lx, ly)}
    if which == 'day':
        extras['clouds'] = [(still_rgb, still_a), (cloud_rgb, cloud_a)]
        lum = luma(still_rgb)[still_a > 0.5]
        extras['cloud_luma'] = [round(float(np.percentile(lum, 5)), 4), round(float(np.percentile(lum, 97)), 4)]
    else:
        # The colours of the night painting's own clouds: their shadowed body
        # and their lit edges, so the day's clouds, relit, belong to it.
        own = found & ~ndi.binary_dilation(land, iterations=20) & (dist > reach)
        lum = luma(img)[own]
        pick = lambda lo, hi: img[own][(lum >= np.percentile(lum, lo)) & (lum <= np.percentile(lum, hi))].mean(0)
        extras['cloud_colors'] = {
            'dark': [round(float(v), 4) for v in pick(5, 20)],
            'light': [round(float(v), 4) for v in pick(92, 99.5)],
        }

    return extras, {
        'width': w,
        'height': h,
        'light': {
            'x': int(x0),
            'y': int(y0),
            'width': int(x1 - x0),
            'height': int(y1 - y0),
            'centerX': lx,
            'centerY': ly,
            'reach': reach,
            'body': body,
            'behind': {
                'x': int(bx0),
                'y': int(by0),
                'width': int(bx1 - bx0),
                'height': int(by1 - by0),
            },
            # The glow profile: RGB added over the sky, from the centre (first)
            # to the reach (last), 64 samples.
            'glow': [
                [round(float(v), 4) for v in glow[int(i * reach / 63)]] for i in range(64)
            ],
        },
        'horizon': int(np.median(horizon)),
    }


def night_cloud(rgb, alpha, q_dist, nc):
    """A day cloud by night: see meta['nightClouds'] and the shader."""
    lo, hi = nc['luma']
    t = np.clip((luma(rgb) - lo) / (hi - lo), 0, 1)
    t = t * t * (3 - 2 * t)
    col = np.array(nc['dark'], np.float32) + (np.array(nc['light'], np.float32) - nc['dark']) * t[..., None]
    col = col + np.array(nc['moonlit'], np.float32) * (np.exp(-q_dist / nc['moonReach']) * t * 0.35)[..., None]
    return np.clip(col, 0, 1), alpha * nc['alpha']


def bake_night(night, clouds, nc):
    """The static night painting (public/bg-night.webp): the night's base with
    the day's clouds, relit, so the page looks the same before the living
    scene starts and under it."""
    base, land_alpha = night['base'], night['land_alpha']
    h, w, _ = base.shape
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    mx, my = night['light']
    q_dist = np.hypot(xx - mx, yy - my)
    out = base.copy()
    sky_open = (1 - land_alpha)[..., None]
    for rgb, a in clouds:
        col, na = night_cloud(rgb, a, q_dist, nc)
        out = out * (1 - na[..., None] * sky_open) + col * na[..., None] * sky_open
    Image.fromarray(np.clip(out * 255 + 0.5, 0, 255).astype(np.uint8), 'RGB').save(
        os.path.join(PUBLIC, 'bg-night.webp'), 'WEBP', quality=88, method=6
    )


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--debug', help='folder for masks and a recomposite check')
    args = parser.parse_args()
    results = {name: split(name, cfg, args.debug) for name, cfg in SETS.items()}
    meta = {name: m for name, (_, m) in results.items()}
    day, night = results['day'][0], results['night'][0]

    # How the day's clouds look by night (the shader does the same): coloured
    # from the night painting's clouds by their brightness, silvered towards
    # the moon, a little thinner.
    meta['nightClouds'] = {
        **night['cloud_colors'],
        'moonlit': [0.62, 0.7, 0.8],
        'moonReach': 300,
        'luma': day['cloud_luma'],
        'alpha': 0.9,
    }
    bake_night(night, day['clouds'], meta['nightClouds'])

    with open(os.path.join(ROOT, 'src', 'scene', 'scene.json'), 'w') as f:
        json.dump(meta, f, indent=2)
        f.write('\n')
    print(json.dumps(meta, indent=2))


if __name__ == '__main__':
    main()
