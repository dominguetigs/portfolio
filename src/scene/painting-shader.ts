/**
 * The living painting: the day and night paintings split into layers
 * (scripts/scene/split_painting.py) and put back together on the GPU, so each
 * layer can move on its own. Everything is computed in image pixels (the
 * painting is 1536 x 1024) and fitted to the screen exactly like the static
 * painting under it (`object-fit: cover`, `object-position: 40% 20%`, scaled
 * by uZoom around that point), so the canvas can fade in over it without a
 * jump. The zoom leaves a margin for the parallax to move into.
 *
 * uT is the time of day: 0 day, 1 night. In between the sun goes down behind
 * the hills through golden hour and dusk, the stars come out, the moon rises
 * and fireflies light up over the grass.
 */

export const paintingVertexShader = /* glsl */ `
  void main() {
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

export const paintingFragmentShader = /* glsl */ `
  precision highp float;

  uniform vec2 uResolution;   // drawing buffer, device px
  uniform vec2 uImageSize;    // painting, image px
  uniform vec2 uObjectPosition;
  uniform float uZoom;
  uniform float uTime;
  uniform float uT;           // 0 day .. 1 night (the toggle's progress)
  uniform float uHorizonY;    // the painted horizon (image px)
  uniform vec2 uPointer;      // -1..1, smoothed
  uniform float uScroll;      // 0 at the top .. 1 one screen down
  uniform float uPixelRatio;
  uniform float uWind;        // 0 calm .. 1 a strong gust
  uniform float uWindPhase;   // accumulated wind travel
  uniform float uCloudPush;   // how far the wind has pushed the clouds
  uniform vec2 uBreeze;       // the pointer, device px from the top left
  uniform float uBreezeStrength;
  uniform float uLeafAge;     // seconds since a gust carried leaves (large: none)
  uniform float uLeafSeed;
  uniform vec3 uPaper;        // light theme background
  uniform vec3 uNight;        // dark theme background

  uniform sampler2D uDayBase;   // the painting with its clouds taken out; a = land.
                                // The only landscape, day and night (D-014).
  uniform sampler2D uDayClouds;      // the clouds that drift (RGBA)
  uniform sampler2D uDayCloudsStill; // the clouds that stay: in the day's base
                                     // by day, drawn relit by night
  // The day's clouds by night (scene.json nightClouds, baked the same way into
  // public/night/night-NN.webp): body and edge colours from the night painting's own
  // clouds, the day clouds' brightness range, the moon's silver, their alpha.
  uniform vec3 uNightCloudDark;
  uniform vec3 uNightCloudLight;
  uniform vec3 uNightCloudMoonlit;
  uniform vec2 uNightCloudLuma;
  uniform float uNightCloudMoonReach;
  uniform float uNightCloudAlpha;
  uniform sampler2D uDayLight;
  uniform sampler2D uDayData;   // r depth, g grass
  uniform vec4 uDayLightBox;  // x, y, width, height (image px)
  uniform sampler2D uDayBehind; // the clean sky behind the disc and its rim
  uniform vec4 uDayBehindBox;
  uniform sampler2D uDayGlow;   // the glow's radial profile (64 x 1)
  uniform vec4 uDayLightCircle; // centre x, y, the glow's reach, the disc's radius

  uniform sampler2D uNightSky;   // the night's sky: its gradient, the moon's glow and disc
  uniform sampler2D uNightLand;  // the day land's colour by night, by its brightness (64 x 1)
  uniform sampler2D uNightLight;
  uniform vec4 uNightLightBox;
  // The real sky over São Paulo (phase 3, sky-layers.ts): stars and
  // constellation lines drawn in painting pixels, the Milky Way as a map in
  // right ascension and declination, the frame that turns painting pixels
  // back into the sky, and the moon's real phase.
  uniform sampler2D uStars;      // RGB
  uniform sampler2D uLines;      // R every line, G the picked constellation
  uniform sampler2D uMilkyWay;   // brightness, x = RA 0..360, y = dec +90..-90
  uniform mat3 uSkyFrame;        // columns: right, up, forward (equatorial)
  uniform vec3 uView;            // projection centre x, y and scale (painting px)
  uniform vec3 uMoonPhase;       // cos(phase angle), +1 waxing / -1 waning, lit fraction
  uniform sampler2D uNightBehind;
  uniform vec4 uNightBehindBox;
  uniform sampler2D uNightGlow;
  uniform vec4 uNightLightCircle;

  float hash12(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }

  vec2 hash22(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.xx + p3.yz) * p3.zy);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash12(i), hash12(i + vec2(1.0, 0.0)), u.x),
      mix(hash12(i + vec2(0.0, 1.0)), hash12(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  vec4 sampleIn(sampler2D tex, vec2 uv) {
    if (uv.x < 0.0 || uv.y < 0.0 || uv.x > 1.0 || uv.y > 1.0) return vec4(0.0);
    return texture2D(tex, uv);
  }

  // How far a layer moves with the pointer and the scroll, by depth.
  vec2 parallax(float depth) {
    vec2 drive = uPointer * vec2(1.0, 0.55) + vec2(0.0, uScroll * 1.4);
    return drive * mix(0.001, 0.011, depth);
  }

  // A day cloud by night: coloured from the night painting's own clouds by
  // its brightness, silvered towards the moon (the same as bake_night in
  // scripts/scene/split_painting.py).
  vec3 nightCloud(vec3 day, vec2 q, vec2 moon) {
    float t = smoothstep(uNightCloudLuma.x, uNightCloudLuma.y,
      dot(day, vec3(0.2126, 0.7152, 0.0722)));
    vec3 col = mix(uNightCloudDark, uNightCloudLight, t);
    col += uNightCloudMoonlit * exp(-length(q - moon) / uNightCloudMoonReach) * t * 0.35;
    return clamp(col, 0.0, 1.0);
  }

  // The light's glow at a distance from its centre: what it adds over the
  // clean sky, nothing beyond its reach.
  const vec3 LUMA = vec3(0.2126, 0.7152, 0.0722);

  // The day's land by night: the night painting's colour for its brightness.
  vec3 nightLand(vec3 day) {
    float l = clamp(dot(day, LUMA), 0.0, 1.0);
    return texture2D(uNightLand, vec2((l * 63.0 + 0.5) / 64.0, 0.5)).rgb;
  }

  // The twilight sky by the sun's elevation (degrees): the colour at the
  // horizon (towards the sun), in the middle and at the top, through golden
  // hour (+4), sunset (0), early civil twilight (-3), the blue hour (-6) and
  // nautical twilight (-10). Taken from photographs of clear evenings.
  void twilightColors(float e, out vec3 hor, out vec3 mid, out vec3 top) {
    float a = clamp((4.0 - e) / 4.0, 0.0, 1.0);
    float b = clamp(-e / 3.0, 0.0, 1.0);
    float c = clamp((-3.0 - e) / 3.0, 0.0, 1.0);
    float d = clamp((-6.0 - e) / 4.0, 0.0, 1.0);
    hor = mix(mix(mix(mix(vec3(1.0, 0.83, 0.6), vec3(1.0, 0.6, 0.33), a),
      vec3(0.95, 0.45, 0.3), b), vec3(0.55, 0.3, 0.3), c), vec3(0.2, 0.16, 0.26), d);
    mid = mix(mix(mix(mix(vec3(0.72, 0.78, 0.84), vec3(0.88, 0.64, 0.6), a),
      vec3(0.62, 0.42, 0.55), b), vec3(0.28, 0.25, 0.42), c), vec3(0.09, 0.12, 0.25), d);
    top = mix(mix(mix(mix(vec3(0.45, 0.62, 0.82), vec3(0.42, 0.48, 0.72), a),
      vec3(0.25, 0.28, 0.52), b), vec3(0.11, 0.14, 0.32), c), vec3(0.04, 0.08, 0.2), d);
  }

  // A cloud's light by the sun's elevation: warm in golden hour, lit pink
  // from below at sunset (it is higher than us and still sees the sun), grey
  // as the light leaves it, then the moon's.
  vec3 cloudLight(vec3 c, float e, vec2 q, vec2 sun, vec2 moon) {
    float l = dot(c, LUMA);
    vec3 col = mix(c, c * vec3(1.06, 0.93, 0.8) + vec3(0.05, 0.03, 0.0), smoothstep(14.0, 3.0, e));
    col = mix(col, l * vec3(1.02, 0.64, 0.56) + vec3(0.06, 0.0, 0.03), smoothstep(3.0, -1.5, e) * 0.85);
    col += vec3(1.0, 0.6, 0.35) * exp(-length(q - sun) / 320.0) * 0.22
      * smoothstep(8.0, 0.0, e) * smoothstep(-5.0, -0.5, e);
    col = mix(col, l * vec3(0.42, 0.38, 0.52), smoothstep(-1.5, -7.0, e));
    return mix(col, nightCloud(c, q, moon), smoothstep(-6.0, -15.0, e));
  }

  vec3 glowAt(sampler2D profile, float d, float reach) {
    if (d >= reach) return vec3(0.0);
    return texture2D(profile, vec2((d / reach * 63.0 + 0.5) / 64.0, 0.5)).rgb;
  }

  vec3 sprite(sampler2D tex, vec4 box, vec2 q, vec2 offset, out float alpha) {
    vec2 s = (q - offset - box.xy) / box.zw;
    vec4 c = sampleIn(tex, s);
    alpha = c.a;
    return c.rgb;
  }

  // Wind over the grass: bright bands that travel across the meadow, the way
  // a gust combs a field. They travel with the wind's accumulated phase, so a
  // gust speeds them up without a jump; where the pointer moves, a small
  // breeze ripples out from it.
  float gust(vec2 q, vec2 frag) {
    float n = noise(q * 0.0035 + vec2(uWindPhase * 0.035, 0.0));
    float band = sin(q.x * 0.011 + q.y * 0.006 - uWindPhase + n * 5.0);
    float field = smoothstep(0.35, 1.0, band)
      * (0.55 + 0.45 * noise(q * 0.01 - uWindPhase * 0.16));
    field *= 0.6 + 1.3 * uWind;
    float dist = length(frag - uBreeze) / uPixelRatio;
    float ring = 0.5 + 0.5 * sin(dist * 0.06 - uTime * 7.0);
    return field + uBreezeStrength * exp(-dist / 140.0) * ring * 1.4;
  }

  // From one section to the next, a gust carries a few leaves across the
  // screen (device px, top left): they flutter, spin and turn over; by night
  // they are silhouettes.
  vec4 leaves(vec2 frag, float night) {
    if (uLeafAge > 7.0) return vec4(0.0);
    float px = uPixelRatio;
    vec3 color = vec3(0.0);
    float alpha = 0.0;
    for (int i = 0; i < 9; i++) {
      float fi = float(i);
      vec2 r = hash22(vec2(fi * 7.13 + uLeafSeed * 3.7, uLeafSeed + fi * 1.9));
      float age = uLeafAge - r.x * 1.2;
      if (age < 0.0) continue;
      float speed = (0.3 + 0.22 * r.y) * uResolution.x;
      vec2 pos = vec2(
        -40.0 * px + age * speed,
        uResolution.y * (0.1 + 0.75 * fract(r.y * 3.1 + r.x))
          + sin(age * (1.6 + r.x) + fi) * 38.0 * px - age * 24.0 * px
      );
      vec2 d = frag - pos;
      if (dot(d, d) > 900.0 * px * px) continue;
      float angle = age * (2.2 + 2.5 * r.x) * (r.y > 0.5 ? 1.0 : -1.0);
      float c = cos(angle);
      float s = sin(angle);
      vec2 p = vec2(c * d.x + s * d.y, -s * d.x + c * d.y) / px;
      float turn = 0.3 + 0.7 * abs(cos(age * (3.0 + 2.0 * r.y) + fi));
      float len = 11.0 + 5.0 * r.x;
      float x = p.x / len;
      float inside = (5.0 + 2.0 * r.y) * turn * (1.0 - x * x) - abs(p.y);
      float a = smoothstep(-0.8, 0.8, inside) * step(abs(x), 1.0);
      if (a <= 0.0) continue;
      vec3 leaf = mix(vec3(0.42, 0.55, 0.2), vec3(0.72, 0.66, 0.28), r.x);
      leaf = leaf * (0.8 + 0.3 * turn) - smoothstep(0.9, 0.0, abs(p.y)) * 0.12;
      leaf = mix(leaf, vec3(0.04, 0.07, 0.1), night);
      color = mix(color, leaf, a);
      alpha = max(alpha, a);
    }
    float fade = smoothstep(7.0, 5.5, uLeafAge);
    return vec4(color, alpha * fade * mix(0.85, 0.65, night));
  }

  vec3 fireflies(vec2 q, float t, float grass) {
    vec3 glow = vec3(0.0);
    vec2 base = floor(q / 70.0);
    for (int y = -1; y <= 1; y++) {
      for (int x = -1; x <= 1; x++) {
        vec2 cell = base + vec2(float(x), float(y));
        vec2 r = hash22(cell * 1.37);
        if (r.x > 0.45) continue;
        vec2 wander = vec2(
          sin(t * (0.35 + r.y * 0.4) + r.x * 40.0),
          cos(t * (0.28 + r.x * 0.5) + r.y * 30.0)
        );
        vec2 p = (cell + 0.5 + 0.4 * wander) * 70.0 + vec2(uWind * 30.0, -uWind * 8.0);
        float d = length(q - p);
        float blink = smoothstep(0.15, 0.9, sin(t * (0.9 + r.y) + r.x * 20.0));
        glow += vec3(1.0, 0.93, 0.45) * (smoothstep(3.0, 0.0, d) + 0.35 * exp(-d / 9.0)) * blink;
      }
    }
    return glow * grass;
  }

  void main() {
    // Fit like object-fit: cover; object-position: 40% 20%. q is image px.
    vec2 frag = vec2(gl_FragCoord.x, uResolution.y - gl_FragCoord.y);
    float scale = max(uResolution.x / uImageSize.x, uResolution.y / uImageSize.y) * uZoom;
    vec2 offset = (uResolution - uImageSize * scale) * uObjectPosition;
    vec2 q = (frag - offset) / scale;
    vec2 uv = q / uImageSize;

    // ---------- the time of day ----------
    // The sun's elevation (degrees) as the toggle runs: down through the
    // afternoon quickly, then slowly through golden hour, sunset and twilight
    // (civil to -6°, nautical to -12°), to night at -16°. Everything below
    // follows it, so a sunrise is the same evening played backwards.
    float elev = uT < 0.2 ? mix(35.0, 10.0, uT / 0.2) : mix(10.0, -16.0, (uT - 0.2) / 0.8);
    float twilight = smoothstep(14.0, 4.0, elev);
    float warm = smoothstep(14.0, 3.0, elev) * (1.0 - smoothstep(0.0, -4.0, elev));
    float afterglow = smoothstep(2.0, -2.0, elev) * smoothstep(-9.0, -3.0, elev);
    float night = smoothstep(-6.0, -15.0, elev);
    float dark = smoothstep(1.0, -9.0, elev);

    // ---------- the painting, warped in depth ----------
    // One image warped by a smooth depth: the meadow moves more than the far
    // hills, and nothing can tear. What moves on its own (the sun, the moon,
    // the clouds) is drawn on it, hidden by the land sampled at the same
    // warped point.
    float depth = texture2D(uDayData, uv).r;
    vec2 dayUv = uv + parallax(depth);
    vec4 base = texture2D(uDayBase, dayUv);
    float land = base.a;
    float skyOpen = 1.0 - land;
    float grass = texture2D(uDayData, dayUv).g;
    vec2 dayQ = dayUv * uImageSize;
    float h = clamp((uHorizonY - dayQ.y) / uHorizonY, 0.0, 1.0);

    // ---------- the sun ----------
    // At rest the sun is the painting's own. As it goes down, its glow (a
    // radial profile measured from the painting) is taken out where it was,
    // the clean sky fills its place, and the profile is drawn where it is:
    // no edge anywhere. It reaches the horizon at 0° and sinks behind the hills.
    float sunMoving = smoothstep(35.0, 33.0, elev);
    vec2 sunMove = vec2(60.0, uHorizonY - uDayLightCircle.y) * (1.0 - elev / 35.0);
    vec2 sunNow = uDayLightCircle.xy + sunMove;
    float sunFrom = length(dayQ - uDayLightCircle.xy);
    float sunLeft = smoothstep(uDayLightCircle.w + 20.0, uDayLightCircle.w + 6.0, sunFrom);
    vec3 sunBehind = texture2D(uDayBehind, (dayQ - uDayBehindBox.xy) / uDayBehindBox.zw).rgb;
    float sunAway = sunMoving * skyOpen;
    vec3 sky = base.rgb - glowAt(uDayGlow, sunFrom, uDayLightCircle.z) * sunAway;
    sky = mix(sky, sunBehind, sunLeft * sunAway);

    // The twilight sky replaces the painted one: warm towards the sun at the
    // horizon, deepening upwards, a breath of the painted strokes kept.
    vec3 tHor;
    vec3 tMid;
    vec3 tTop;
    twilightColors(elev, tHor, tMid, tTop);
    float towardsSun = 0.3 + 0.7 * exp(-pow((dayQ.x - sunNow.x) / (uImageSize.x * 0.42), 2.0));
    vec3 tw = mix(mix(tMid, tHor, towardsSun), tMid, smoothstep(0.0, 0.25, h));
    tw = mix(tw, tTop, smoothstep(0.2, 0.95, h));
    tw *= 0.93 + 0.14 * clamp(dot(sky, LUMA) / 0.62, 0.6, 1.4);
    sky = mix(sky, tw, twilight);

    // The setting sun: whiter high, orange low, and an aureole in the air
    // around it that grows as it nears the horizon.
    vec3 sunColor = mix(vec3(1.0), vec3(1.25, 0.6, 0.35), smoothstep(14.0, 0.0, elev));
    float sunUp = smoothstep(-3.0, 1.0, elev);
    float fromSun = length(dayQ - sunNow);
    sky += glowAt(uDayGlow, fromSun, uDayLightCircle.z) * sunColor * sunAway * sunUp;
    sky += vec3(1.0, 0.66, 0.4) * exp(-fromSun / 240.0) * 0.3 * (warm + afterglow) * skyOpen;

    // The painted sun breathes at rest: a soft warm pulse, no edge anywhere.
    sky += vec3(1.0, 0.92, 0.7) * exp(-sunFrom / 110.0)
      * 0.035 * (0.5 + 0.5 * sin(uTime * 0.6)) * skyOpen * (1.0 - sunMoving);

    // ---------- the night sky ----------
    // The moon: the painted one at rest (in the night's sky); while it rises
    // with the dusk, its glow and disc come up from behind the hills, already
    // pale in the twilight, and end exactly on it.
    float moonMoving = 1.0 - smoothstep(-14.0, -15.8, elev);
    float moonUp = smoothstep(-1.0, -14.0, elev);
    vec2 moonMove = vec2(-40.0, 520.0) * (1.0 - moonUp) * (1.0 - moonUp);
    vec2 moonNow = uNightLightCircle.xy + moonMove;
    float moonFrom = length(dayQ - uNightLightCircle.xy);
    float moonLeft = smoothstep(uNightLightCircle.w + 20.0, uNightLightCircle.w + 6.0, moonFrom);
    float moonAway = moonMoving * skyOpen;
    // The moon's real phase dims its glow (at rest the painted glow gives way
    // to what the lit fraction gives).
    float glowScale = pow(uMoonPhase.z, 0.7);
    vec3 nightSky = texture2D(uNightSky, dayUv).rgb
      - glowAt(uNightGlow, moonFrom, uNightLightCircle.z)
        * skyOpen * (moonMoving + (1.0 - moonMoving) * (1.0 - glowScale));
    nightSky = mix(nightSky, texture2D(uNightBehind,
      (dayQ - uNightBehindBox.xy) / uNightBehindBox.zw).rgb, moonLeft * moonAway);
    sky = mix(sky, nightSky, night);

    float moonVis = smoothstep(1.0, -5.0, elev);
    vec3 skyBeforeMoon = sky;
    sky += glowAt(uNightGlow, length(dayQ - moonNow), uNightLightCircle.z)
      * moonAway * glowScale * moonVis;
    float moonA;
    vec3 moon = sprite(uNightLight, uNightLightBox, dayQ, moonMove, moonA);
    sky = mix(sky, moon, moonA * moonAway * moonVis);

    // The real phase on the disc: the unlit part is the sky behind it plus
    // the glow in our air, in front of it (a dark limb has no bright edge).
    // Seen from the southern hemisphere, the waxing moon is lit on the left.
    float fromMoon = length(dayQ - moonNow);
    vec2 disc = (dayQ - moonNow) / (uNightLightCircle.w + 3.0);
    float onDisc = smoothstep(1.16, 0.98, length(disc)) * skyOpen;
    float side = -disc.x * uMoonPhase.y;
    float terminator = uMoonPhase.x * sqrt(max(1.0 - disc.y * disc.y, 0.0));
    float lit = smoothstep(-0.06, 0.06, side - terminator);
    vec3 behindDisc = mix(texture2D(uNightBehind,
      (dayQ - moonMove - uNightBehindBox.xy) / uNightBehindBox.zw).rgb, skyBeforeMoon, moonMoving);
    vec3 airGlow = glowAt(uNightGlow, max(fromMoon, uNightLightCircle.w + 8.0), uNightLightCircle.z)
      * glowScale * moonVis;
    sky = mix(sky, behindDisc + airGlow + sky * 0.04, (1.0 - lit) * onDisc);

    // ---------- the real sky (phase 3) ----------
    // Behind the clouds and the land, hidden by the moon's disc, washed out
    // near it; the brightest stars come out first in the dusk.
    vec2 drift = vec2(0.045 * sin(uTime * 0.026) + uCloudPush, 0.0);
    vec4 still = sampleIn(uDayCloudsStill, dayUv);
    vec4 cloud = sampleIn(uDayClouds, dayUv + drift);
    float clouded = clamp(max(still.a, cloud.a) * 1.8, 0.0, 1.0);
    float nearMoon = smoothstep(uNightLightCircle.w * 1.05, uNightLightCircle.w * 2.4, fromMoon);
    float open = skyOpen * (1.0 - clouded);
    float deep = smoothstep(-9.0, -15.0, elev);

    // The Milky Way and the Magellanic Clouds: each pixel turned back into a
    // direction in the sky (inverse stereographic), then into right ascension
    // and declination. Moonlight washes them out.
    vec2 P = vec2(dayQ.x - uView.x, uView.y - dayQ.y) / uView.z;
    float rho2 = dot(P, P);
    vec3 cam = vec3(4.0 * P, 4.0 - rho2) / (4.0 + rho2);
    vec3 eq = uSkyFrame * cam;
    float ra = atan(eq.y, eq.x) / 6.2831853;
    float dec = asin(clamp(eq.z, -1.0, 1.0));
    float galaxy = texture2D(uMilkyWay, vec2(fract(ra), 0.5 - dec / 3.1415927)).r;
    // (Light added after the painting is washed into the page, below, like
    // the fireflies: washed, the stars would all but disappear.)
    vec3 skyLight = vec3(0.55, 0.63, 0.8) * galaxy * 0.11 * (1.0 - 0.55 * uMoonPhase.z)
      * open * deep * mix(0.4, 1.0, nearMoon);

    // The constellations, in a thin line; the one picked out a little more.
    vec2 lines = texture2D(uLines, dayQ / uImageSize).rg;
    skyLight += vec3(0.7, 0.78, 0.92) * (lines.r * 0.05 + lines.g * 0.34) * open * deep * nearMoon;

    // The stars, twinkling (a slow noise, so each star keeps one phase).
    vec3 starLight = texture2D(uStars, dayQ / uImageSize).rgb;
    float starVis = clamp((-elev - 4.0) / 9.0 + (dot(starLight, vec3(0.333)) - 0.45) * 1.4, 0.0, 1.0);
    float twinkle = 0.74 + 0.26 * sin(uTime * 2.1 + noise(dayQ * 0.09) * 14.0);
    skyLight += starLight * twinkle * starVis * open * nearMoon;

    // ---------- the clouds: one set, relit by the hour ----------
    // The same shapes in the same places all day and night: only their light
    // changes. They hide the stars and pass in front of the moon.
    float cloudAlpha = mix(1.0, uNightCloudAlpha, night);
    sky = mix(sky, cloudLight(still.rgb, elev, dayQ, sunNow, moonNow), still.a * cloudAlpha);
    sky = mix(sky, cloudLight(cloud.rgb, elev, dayQ, sunNow, moonNow), cloud.a * cloudAlpha);

    // ---------- the land: the day's, relit by the hour ----------
    // Warm in golden hour, in shade once the sun touches the hills, blue and
    // flat in the blue hour, then the night painting's colours (D-014).
    vec3 landDay = base.rgb * (1.0 + gust(dayQ, frag) * grass * mix(0.12, 0.18, night));
    float landLuma = dot(landDay, LUMA);
    vec3 landCol = mix(landDay, landDay * vec3(1.03, 0.86, 0.64), smoothstep(14.0, 3.0, elev));
    landCol = mix(landCol, landCol * vec3(0.62, 0.5, 0.5), smoothstep(3.0, -1.0, elev));
    landCol = mix(landCol, mix(vec3(landLuma), landDay, 0.35) * vec3(0.32, 0.36, 0.52),
      smoothstep(-1.0, -6.0, elev));
    landCol = mix(landCol, nightLand(landDay), night);

    vec3 painting = mix(sky, landCol, land);

    // ---------- washed into the page, like the static painting ----------
    vec3 page = mix(uPaper, uNight, dark);
    float opacity = mix(0.35, 0.6, smoothstep(-2.0, -12.0, elev)) + 0.2 * warm + 0.25 * afterglow;
    vec3 color = mix(page, painting, clamp(opacity, 0.0, 1.0));

    // The real sky's light, over the washed painting.
    color += skyLight;

    // The page's own fade towards the bottom (ghibli-background's gradient:
    // background/85 at the bottom, /30 halfway up, nothing at the top; /90
    // and /40 at night), drawn here so the fireflies can glow above it.
    float fromBottom = gl_FragCoord.y / uResolution.y;
    float lower = mix(0.85, 0.9, night);
    float middle = mix(0.3, 0.4, night);
    float fade = fromBottom < 0.5
      ? mix(lower, middle, fromBottom / 0.5)
      : mix(middle, 0.0, (fromBottom - 0.5) / 0.5);
    color = mix(color, page, fade);

    vec4 leaf = leaves(frag, night);
    color = mix(color, leaf.rgb, leaf.a);

    color += fireflies(dayQ, uTime, grass * land) * smoothstep(-8.0, -14.0, elev) * 0.85;

    gl_FragColor = vec4(color, 1.0);
  }
`;
