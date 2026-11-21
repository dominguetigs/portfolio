"""Split the day and night paintings into the layers the living scene animates.

Run once when a painting changes (needs numpy, pillow and scipy):

    python3 scripts/scene/split_painting.py [--debug DIR]

For each painting (public/bg-light.png = day, public/bg-dark.png = night) it
writes to public/scene/:

- <set>-sky.webp     the sky alone: clouds, sun or moon and land removed, the
                     holes filled from the clear sky around them
- <set>-clouds.webp  the painted clouds (RGBA), matted against that sky, so
                     they can drift over it
- <set>-light.webp   the sun (day) or the moon (night) as a sprite (RGBA)
- <set>-land.webp    hills, trees and meadow (RGBA, soft edge)
- <set>-data.webp    half size; R: depth (0 sky .. 1 nearest meadow),
                     G: grass mask

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
OUT = os.path.join(PUBLIC, 'scene')

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


def find_light(img):
    """The sun or the moon: the brightest blob in the upper half."""
    h = img.shape[0]
    v = img.max(-1)[: h // 2]
    t = np.percentile(v, 99.7)
    ys, xs = np.where(v >= t)
    return int(xs.mean()), int(ys.mean())


def save_rgba(rgb, alpha, path, quality=82, scale=1.0):
    a = np.dstack([rgb, alpha[..., None]])
    im = Image.fromarray(np.clip(a * 255 + 0.5, 0, 255).astype(np.uint8), 'RGBA')
    if scale != 1.0:
        im = im.resize((round(im.width * scale), round(im.height * scale)), Image.LANCZOS)
    im.save(path, 'WEBP', quality=quality, alpha_quality=90, method=6)


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
    cloud = sky & ~disc & (lift > cfg['cloud_lift'])
    cloud = ndi.binary_dilation(ndi.binary_opening(cloud, iterations=1), iterations=4)

    # The clean sky. Under the land it continues the sky from well above the
    # horizon, so that parallax never uncovers the treetops left at its edge.
    clear = sky & ~cloud & ~light_zone
    plate = fill_holes(img, clear)
    near_land = ndi.binary_dilation(land, iterations=40)
    under = fill_holes(img, clear & ~near_land)
    plate = np.where(near_land[..., None] & ~clear[..., None], under, plate)

    # Matte the clouds and the light against the clean sky: alpha from how
    # much brighter the pixel is, colour unmixed so it composites back exactly.
    def matte(zone, gain):
        diff = np.clip(luma(img) - luma(plate), 0, None)
        a = np.clip(diff * gain, 0, 1) * zone
        a = ndi.gaussian_filter(a, 0.8)
        safe = np.maximum(a, 1e-3)[..., None]
        col = np.clip((img - plate * (1 - a[..., None])) / safe, 0, 1)
        # Where it is all but transparent the unmixed colour is noise: use the
        # sky's, which compresses and filters cleanly.
        col = np.where(a[..., None] < 0.03, plate, col)
        return col, a

    cloud_zone = ndi.gaussian_filter(cloud.astype(np.float32), 2)
    cloud_rgb, cloud_a = matte(cloud_zone, 6.0 if which == 'day' else 9.0)

    light_soft = np.clip((cfg['light_radius'] - dist) / 30, 0, 1) * (1 - cloud_zone)
    light_rgb, light_a = matte(light_soft, 2.2 if which == 'day' else 3.0)

    # Depth: 0 for the sky, then from the horizon (far) to the bottom (near).
    hz = horizon[None, :].astype(np.float32)
    depth = np.clip((yy - hz) / np.maximum(h - hz, 1), 0, 1) ** 0.8
    depth = 0.25 + 0.75 * depth
    depth = np.where(land, depth, 0)
    depth = ndi.gaussian_filter(depth, 4)

    # Grass: the meadow, not the dark tree crowns, a little below the horizon.
    r, g, b = img[..., 0], img[..., 1], img[..., 2]
    if which == 'day':
        grassy = (g / (b + 1e-3) > 2.2) & (luma(img) > 0.22)
    else:
        grassy = (g / (b + 1e-3) > 0.72) & (luma(img) > 0.08)
    grass = land & grassy & (yy > hz + 25)
    grass = ndi.gaussian_filter(grass.astype(np.float32), 3)

    os.makedirs(OUT, exist_ok=True)
    save_rgb(plate, os.path.join(OUT, f'{which}-sky.webp'))
    # Clouds are soft: three quarters of the size is enough.
    save_rgba(cloud_rgb, cloud_a, os.path.join(OUT, f'{which}-clouds.webp'), quality=76, scale=0.75)
    save_rgba(img, land_alpha, os.path.join(OUT, f'{which}-land.webp'))

    # The light as a tight sprite.
    ys, xs = np.where(light_a > 0.01)
    x0, x1, y0, y1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
    save_rgba(light_rgb[y0:y1, x0:x1], light_a[y0:y1, x0:x1], os.path.join(OUT, f'{which}-light.webp'), quality=90)

    data = np.dstack([depth, grass, np.zeros_like(depth)])
    Image.fromarray(np.clip(data * 255 + 0.5, 0, 255).astype(np.uint8), 'RGB').resize(
        (w // 2, h // 2), Image.LANCZOS
    ).save(os.path.join(OUT, f'{which}-data.webp'), 'WEBP', quality=90, method=6)

    if debug:
        os.makedirs(debug, exist_ok=True)
        Image.fromarray((land * 255).astype(np.uint8)).save(os.path.join(debug, f'{which}-land-mask.png'))
        Image.fromarray((cloud * 255).astype(np.uint8)).save(os.path.join(debug, f'{which}-cloud-mask.png'))
        save_rgb(plate, os.path.join(debug, f'{which}-plate.webp'))
        # Recomposite check: sky + clouds + light + land must give the painting back.
        comp = plate * (1 - light_a[..., None]) + light_rgb * light_a[..., None]
        comp = comp * (1 - cloud_a[..., None]) + cloud_rgb * cloud_a[..., None]
        comp = comp * (1 - land_alpha[..., None]) + img * land_alpha[..., None]
        save_rgb(comp, os.path.join(debug, f'{which}-recomposite.webp'))
        err = np.abs(comp - img).mean()
        print(f'{which}: recomposite mean abs error {err:.4f}')

    return {
        'width': w,
        'height': h,
        'light': {
            'x': int(x0),
            'y': int(y0),
            'width': int(x1 - x0),
            'height': int(y1 - y0),
            'centerX': lx,
            'centerY': ly,
        },
        'horizon': int(np.median(horizon)),
    }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--debug', help='folder for masks and a recomposite check')
    args = parser.parse_args()
    meta = {name: split(name, cfg, args.debug) for name, cfg in SETS.items()}
    with open(os.path.join(ROOT, 'src', 'scene', 'scene.json'), 'w') as f:
        json.dump(meta, f, indent=2)
        f.write('\n')
    print(json.dumps(meta, indent=2))


if __name__ == '__main__':
    main()
