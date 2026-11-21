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
  uniform vec3 uPaper;        // light theme background
  uniform vec3 uNight;        // dark theme background

  uniform sampler2D uDaySky;
  uniform sampler2D uDayClouds;
  uniform sampler2D uDayLight;
  uniform sampler2D uDayLand;
  uniform sampler2D uDayData;
  uniform vec4 uDayLightBox;  // x, y, width, height (image px)

  uniform sampler2D uNightSky;
  uniform sampler2D uNightClouds;
  uniform sampler2D uNightLight;
  uniform sampler2D uNightLand;
  uniform sampler2D uNightData;
  uniform vec4 uNightLightBox;

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
    return drive * mix(0.002, 0.012, depth);
  }

  vec3 sprite(sampler2D tex, vec4 box, vec2 q, vec2 offset, out float alpha) {
    vec2 s = (q - offset - box.xy) / box.zw;
    vec4 c = sampleIn(tex, s);
    alpha = c.a;
    return c.rgb;
  }

  // Wind over the grass: bright bands that travel across the meadow, the way
  // a gust combs a field.
  float gust(vec2 q) {
    float t = uTime;
    float n = noise(q * 0.0035 + vec2(t * 0.04, 0.0));
    float band = sin(q.x * 0.011 + q.y * 0.006 - t * 1.25 + n * 5.0);
    return smoothstep(0.35, 1.0, band) * (0.55 + 0.45 * noise(q * 0.01 - t * 0.2));
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
        vec2 p = (cell + 0.5 + 0.4 * wander) * 70.0;
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
    // The sky leans towards a golden-hour gradient, then a dusk one (warm at
    // the horizon, cooler above), keeping some of the painted strokes.
    vec2 skyUv = uv + parallax(0.0);
    vec3 day = texture2D(uDaySky, skyUv).rgb;
    float horizonward = pow(clamp(uv.y / 0.72, 0.0, 1.0), 1.6);
    vec3 goldenSky = mix(vec3(0.62, 0.7, 0.86), vec3(1.0, 0.8, 0.5), horizonward);
    vec3 duskSky = mix(vec3(0.2, 0.2, 0.42), vec3(0.96, 0.5, 0.44), horizonward);
    day = mix(day, goldenSky * (0.75 + 0.35 * day), golden * 0.6);
    day = mix(day, duskSky * (0.8 + 0.3 * day), dusk * 0.75);

    // The sun breathes, then goes down behind the hills, turning orange.
    float set = smoothstep(0.0, 0.6, uT);
    vec2 sunMove = vec2(60.0, 560.0) * set * set;
    float sunA;
    vec3 sun = sprite(uDayLight, uDayLightBox, skyUv * uImageSize, sunMove, sunA);
    float breathe = 1.0 + 0.06 * sin(uTime * 0.6);
    vec3 setting = vec3(1.0, 0.55, 0.28);
    sun = mix(sun, setting * (0.6 + 0.5 * sun), smoothstep(0.05, 0.45, uT));
    day = mix(day, sun, clamp(sunA * breathe, 0.0, 1.0));

    // Clouds drift slowly back and forth, lit warm, then pink, as it sets.
    vec2 drift = vec2(0.045 * sin(uTime * 0.026), 0.0);
    vec4 cloud = sampleIn(uDayClouds, uv + parallax(0.08) + drift);
    cloud.rgb = mix(cloud.rgb, cloud.rgb * vec3(1.15, 0.86, 0.62) + vec3(0.08, 0.03, 0.0), golden);
    cloud.rgb = mix(cloud.rgb, cloud.rgb * vec3(0.95, 0.58, 0.72) + vec3(0.06, 0.0, 0.04), dusk);
    day = mix(day, cloud.rgb, cloud.a);

    // The land, moved by its own depth; the grass catches the wind.
    float dayDepth = texture2D(uDayData, uv).r;
    vec2 dayLandUv = uv + parallax(dayDepth);
    vec4 dayLand = texture2D(uDayLand, dayLandUv);
    float dayGrass = texture2D(uDayData, dayLandUv).g;
    dayLand.rgb *= 1.0 + gust(dayLandUv * uImageSize) * dayGrass * 0.12;
    dayLand.rgb = mix(dayLand.rgb, dayLand.rgb * vec3(0.95, 0.78, 0.55), golden);
    dayLand.rgb = mix(dayLand.rgb, dayLand.rgb * vec3(0.42, 0.36, 0.55), dusk);
    day = mix(day, dayLand.rgb, dayLand.a);

    // ---------- the night painting ----------
    vec3 nightCol = texture2D(uNightSky, skyUv).rgb;
    float skyOpen = 1.0 - texture2D(uNightLand, uv).a;
    nightCol += stars(skyUv * uImageSize, uTime) * skyOpen * smoothstep(0.6, 1.0, uT);

    // The moon rises from behind the hills.
    float rise = 1.0 - smoothstep(0.5, 1.0, uT);
    vec2 moonMove = vec2(-40.0, 520.0) * rise * rise;
    float moonA;
    vec3 moon = sprite(uNightLight, uNightLightBox, skyUv * uImageSize, moonMove, moonA);
    nightCol = mix(nightCol, moon, moonA * (0.96 + 0.04 * sin(uTime * 0.5)));

    vec4 nightCloud = sampleIn(uNightClouds, uv + parallax(0.08) + drift);
    nightCol = mix(nightCol, nightCloud.rgb, nightCloud.a);

    float nightDepth = texture2D(uNightData, uv).r;
    vec2 nightLandUv = uv + parallax(nightDepth);
    vec4 nightLand = texture2D(uNightLand, nightLandUv);
    float nightGrass = texture2D(uNightData, nightLandUv).g;
    nightLand.rgb *= 1.0 + gust(nightLandUv * uImageSize) * nightGrass * 0.18;
    nightCol = mix(nightCol, nightLand.rgb, nightLand.a);

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

    color += fireflies(nightLandUv * uImageSize, uTime, nightGrass * nightLand.a)
      * smoothstep(0.7, 1.0, uT) * 0.85;

    gl_FragColor = vec4(color, 1.0);
  }
`;
