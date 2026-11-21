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
  uniform float uT;           // 0 day .. 1 night
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

  uniform sampler2D uDayBase;   // the painting without clouds and sun; a = land
  uniform sampler2D uDayClouds;
  uniform sampler2D uDayLight;
  uniform sampler2D uDayData;   // r depth, g grass
  uniform vec4 uDayLightBox;  // x, y, width, height (image px)
  uniform sampler2D uDayBehind; // the clean sky behind the disc and its rim
  uniform vec4 uDayBehindBox;
  uniform sampler2D uDayGlow;   // the glow's radial profile (64 x 1)
  uniform vec4 uDayLightCircle; // centre x, y, the glow's reach, the disc's radius

  uniform sampler2D uNightBase;
  uniform sampler2D uNightClouds;
  uniform sampler2D uNightLight;
  uniform sampler2D uNightData;
  uniform vec4 uNightLightBox;
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

  float bell(float x, float center, float width) {
    float d = (x - center) / width;
    return exp(-d * d * 2.0);
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

  // The light's glow at a distance from its centre: what it adds over the
  // clean sky, nothing beyond its reach.
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

  vec3 stars(vec2 q, float t) {
    vec2 cell = floor(q / 9.0);
    vec2 r = hash22(cell);
    if (r.x > 0.07) return vec3(0.0);
    vec2 center = (cell + 0.2 + 0.6 * hash22(cell + 7.0)) * 9.0;
    float d = length(q - center);
    float twinkle = 0.55 + 0.45 * sin(t * (1.0 + 3.0 * r.y) + r.x * 90.0);
    float size = mix(0.6, 1.5, r.y);
    return vec3(0.85, 0.9, 1.0) * smoothstep(size, 0.0, d) * twinkle;
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

    float night = smoothstep(0.45, 0.9, uT);
    float golden = bell(uT, 0.22, 0.2);
    float dusk = bell(uT, 0.5, 0.18);

    // ---------- the day painting, with its sunset ----------
    // One image (the painting without its clouds and its sun) warped by a
    // smooth depth: the meadow moves more than the far hills, and nothing can
    // tear. What really moves (the sun, the clouds) is drawn on it, hidden by
    // the land sampled at the same warped point, so it stays behind the hills.
    float dayDepth = texture2D(uDayData, uv).r;
    vec2 dayUv = uv + parallax(dayDepth);
    vec4 dayBase = texture2D(uDayBase, dayUv);
    float dayLand = dayBase.a;
    float daySky = 1.0 - dayLand;
    float dayGrass = texture2D(uDayData, dayUv).g;
    vec2 dayQ = dayUv * uImageSize;

    // At rest the sun is the painting's own. While it sets, its glow (a
    // radial profile measured from the painting) is taken out where it was
    // and drawn where it is, and the clean sky fills the place the disc
    // leaves: at the first instant that is exactly the painting, and the glow
    // fades to nothing at its reach, so there is no edge anywhere.
    float sunMoving = smoothstep(0.0, 0.08, uT);
    float set = smoothstep(0.0, 0.6, uT);
    vec2 sunMove = vec2(60.0, 560.0) * set * set;
    float setting = smoothstep(0.05, 0.45, uT);
    float sunFrom = length(dayQ - uDayLightCircle.xy);
    float sunLeft = smoothstep(uDayLightCircle.w + 20.0, uDayLightCircle.w + 6.0, sunFrom);
    vec3 sunBehind = texture2D(uDayBehind, (dayQ - uDayBehindBox.xy) / uDayBehindBox.zw).rgb;
    float sunAway = sunMoving * daySky;
    vec3 day = dayBase.rgb - glowAt(uDayGlow, sunFrom, uDayLightCircle.z) * sunAway;
    day = mix(day, sunBehind, sunLeft * sunAway);
    day *= 1.0 + gust(dayQ, frag) * dayGrass * 0.12;

    // The sky leans towards a golden-hour gradient, then a dusk one (warm at
    // the horizon, cooler above), keeping some of the painted strokes; the
    // land warms, then turns violet.
    float horizonward = pow(clamp(uv.y / 0.72, 0.0, 1.0), 1.6);
    vec3 goldenSky = mix(vec3(0.62, 0.7, 0.86), vec3(1.0, 0.8, 0.5), horizonward);
    vec3 duskSky = mix(vec3(0.2, 0.2, 0.42), vec3(0.96, 0.5, 0.44), horizonward);
    vec3 skyLit = mix(day, goldenSky * (0.75 + 0.35 * day), golden * 0.6);
    skyLit = mix(skyLit, duskSky * (0.8 + 0.3 * skyLit), dusk * 0.75);
    vec3 landLit = mix(day, day * vec3(0.95, 0.78, 0.55), golden);
    landLit = mix(landLit, landLit * vec3(0.42, 0.36, 0.55), dusk);
    day = mix(skyLit, landLit, dayLand);

    // The setting sun, light over the sky, turning orange, hidden by the
    // hills. Its disc is uniform, so the profile alone draws it whole: disc
    // and glow in one, with no edge between them.
    vec3 sunTint = mix(vec3(1.0), vec3(1.25, 0.6, 0.35), setting);
    day += glowAt(uDayGlow, length(dayQ - uDayLightCircle.xy - sunMove), uDayLightCircle.z)
      * sunTint * sunAway;

    // The painted sun breathes: a soft warm pulse, no edge anywhere.
    float sunDist = length(dayQ - uDayLightCircle.xy);
    day += vec3(1.0, 0.92, 0.7) * exp(-sunDist / 110.0)
      * 0.035 * (0.5 + 0.5 * sin(uTime * 0.6)) * daySky * (1.0 - sunMoving);

    // Clouds drift slowly back and forth; a gust pushes them on a little.
    // They are lit warm, then pink, as the sun sets.
    vec2 drift = vec2(0.045 * sin(uTime * 0.026) + uCloudPush, 0.0);
    vec4 cloud = sampleIn(uDayClouds, dayUv + drift);
    cloud.rgb = mix(cloud.rgb, cloud.rgb * vec3(1.15, 0.86, 0.62) + vec3(0.08, 0.03, 0.0), golden);
    cloud.rgb = mix(cloud.rgb, cloud.rgb * vec3(0.95, 0.58, 0.72) + vec3(0.06, 0.0, 0.04), dusk);
    day = mix(day, cloud.rgb, cloud.a * daySky);

    // ---------- the night painting ----------
    float nightDepth = texture2D(uNightData, uv).r;
    vec2 nightUv = uv + parallax(nightDepth);
    vec4 nightBase = texture2D(uNightBase, nightUv);
    float nightLand = nightBase.a;
    float nightSky = 1.0 - nightLand;
    float nightGrass = texture2D(uNightData, nightUv).g;
    vec2 nightQ = nightUv * uImageSize;

    // Likewise the moon: the painting's own at rest; while it rises, its
    // glow and disc move up from behind the hills and end exactly on the
    // painted moon.
    float moonMoving = 1.0 - smoothstep(0.92, 1.0, uT);
    float rise = 1.0 - smoothstep(0.5, 1.0, uT);
    vec2 moonMove = vec2(-40.0, 520.0) * rise * rise;
    float moonFrom = length(nightQ - uNightLightCircle.xy);
    float moonLeft = smoothstep(uNightLightCircle.w + 20.0, uNightLightCircle.w + 6.0, moonFrom);
    vec3 moonBehind = texture2D(uNightBehind, (nightQ - uNightBehindBox.xy) / uNightBehindBox.zw).rgb;
    float moonAway = moonMoving * nightSky;
    vec3 nightCol = nightBase.rgb - glowAt(uNightGlow, moonFrom, uNightLightCircle.z) * moonAway;
    nightCol = mix(nightCol, moonBehind, moonLeft * moonAway);
    nightCol *= 1.0 + gust(nightQ, frag) * nightGrass * 0.18;
    nightCol += stars(nightQ, uTime) * nightSky * smoothstep(0.6, 1.0, uT);

    nightCol += glowAt(uNightGlow, length(nightQ - uNightLightCircle.xy - moonMove), uNightLightCircle.z)
      * moonAway;
    float moonA;
    vec3 moon = sprite(uNightLight, uNightLightBox, nightQ, moonMove, moonA);
    nightCol = mix(nightCol, moon, moonA * moonAway);

    vec4 nightCloud = sampleIn(uNightClouds, nightUv + drift);
    nightCol = mix(nightCol, nightCloud.rgb, nightCloud.a * nightSky);

    // ---------- washed into the page, like the static painting ----------
    vec3 painting = mix(day, nightCol, night);
    vec3 page = mix(uPaper, uNight, smoothstep(0.35, 0.8, uT));
    float opacity = mix(0.35, 0.6, night) + 0.25 * golden + 0.3 * dusk;
    vec3 color = mix(page, painting, clamp(opacity, 0.0, 1.0));

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

    color += fireflies(nightUv * uImageSize, uTime, nightGrass * nightLand)
      * smoothstep(0.7, 1.0, uT) * 0.85;

    gl_FragColor = vec4(color, 1.0);
  }
`;
