/**
 * Builds the résumés (public/cv/resume-en.pdf, resume-pt.pdf) from the same
 * data as the site: the experience (src/sections/experience/positions.json and
 * messages/*.json), education, courses and languages from the messages, and
 * what only the résumé has (headline, summary, achievements, featured
 * project, skills, awards) from scripts/cv/content.json.
 *
 *   node scripts/cv/build.mjs
 *
 * Printed by Google Chrome, headless (CHROME_PATH to use another Chromium).
 */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = resolve(import.meta.dirname, '..', '..');
const CHROME =
  process.env.CHROME_PATH ??
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const read = path => JSON.parse(readFileSync(join(ROOT, path), 'utf8'));
const content = read('scripts/cv/content.json');
const positions = read('src/sections/experience/positions.json');

const esc = text =>
  String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');

function month(yearMonth, months) {
  const [year, m] = yearMonth.split('-').map(Number);
  return `${months[m - 1]} ${year}`;
}

function period(start, end, months, present) {
  return `${month(start, months)} – ${end ? month(end, months) : present}`;
}

function entry(date, body) {
  return `<div class="entry"><div class="date">${date}</div><div class="body">${body}</div></div>`;
}

function section(title, inner) {
  return `<section><h2><span class="bar"></span>${esc(title)}</h2>${inner}</section>`;
}

const list = items =>
  `<ul>${items.map(item => `<li>${esc(item)}</li>`).join('')}</ul>`;

function render(locale) {
  const messages = read(`messages/${locale}.json`).Index;
  const own = content[locale];
  const { labels } = own;
  const experience = messages.Experience;
  const months = experience.months;
  const contact = content.contact;

  const jobs = positions
    .map(position => {
      const copy = experience.positions[position.id];
      const starts = position.roles.map(r => r.start).sort();
      const current = position.roles.some(r => !r.end);
      const ends = position.roles.map(r => r.end ?? '').sort();
      const span = period(
        starts[0],
        current ? undefined : ends.at(-1),
        months,
        labels.present,
      );
      const roles = position.roles
        .map(role => {
          const roleCopy = copy.roles[role.id];
          const head =
            position.roles.length > 1
              ? `<div class="role">${esc(roleCopy.title)} <span class="muted">· ${period(role.start, role.end, months, labels.present)}</span></div>`
              : `<div class="role">${esc(roleCopy.title)}</div>`;
          return head + list(roleCopy.responsibilities);
        })
        .join('');
      const stack = position.technologies.length
        ? `<div class="stack"><span>${esc(labels.stack)}:</span> ${esc(position.technologies.join(', '))}</div>`
        : '';
      return entry(
        span.replace(' – ', '<br>– '),
        `<div class="org">${esc(copy.company)} <span class="muted">· ${esc(position.location)}</span></div>${roles}${stack}`,
      );
    })
    .join('');

  const project = own.project;
  const education = messages.Education.sections;

  const html = `<!doctype html>
<html lang="${locale}">
<head>
<meta charset="utf-8">
<title>Gustavo Domingueti</title>
<style>
  @page { size: A4; margin: 12mm 14mm 13mm; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 9.1pt; line-height: 1.38; color: #1f2328; }
  :root { --blue: #3973b3; --muted: #6b7280; }
  header { display: flex; justify-content: space-between; align-items: flex-end; gap: 24px; margin-bottom: 14px; }
  h1 { font-size: 30pt; font-weight: 300; letter-spacing: -0.5px; margin: 0; line-height: 1; }
  .headline { color: var(--muted); font-size: 10pt; margin-top: 6px; }
  .contact { text-align: right; font-size: 8.6pt; color: var(--muted); font-style: italic; line-height: 1.55; white-space: nowrap; }
  .contact a { color: inherit; text-decoration: none; }
  section { margin-top: 10px; }
  h2 { display: flex; align-items: center; gap: 10px; font-size: 13pt; font-weight: 400; color: var(--blue); margin: 0 0 6px; break-after: avoid; }
  h2 .bar { display: inline-block; width: 104px; height: 5px; background: var(--blue); flex: none; }
  .entry { display: grid; grid-template-columns: 104px 1fr; gap: 10px; margin-bottom: 6px; }
  .org, .role { break-after: avoid; }
  li { break-inside: avoid; }
  .date { text-align: right; font-size: 8.6pt; color: #374151; padding-top: 1px; }
  .org { font-weight: 700; }
  .role { font-style: italic; margin-top: 3px; }
  .muted { color: var(--muted); font-weight: 400; font-style: normal; }
  ul { margin: 3px 0 0; padding-left: 14px; }
  li { margin: 0; }
  li::marker { color: var(--blue); }
  .stack { font-size: 8.6pt; color: #374151; margin-top: 3px; }
  .stack span { color: var(--muted); }
  p { margin: 0 0 6px; }
  .indent { margin-left: 114px; }
  .skills { display: grid; grid-template-columns: 104px 1fr; gap: 3px 10px; }
  .skills dt { text-align: right; font-size: 8.6pt; color: #374151; }
  .skills dd { margin: 0; }
</style>
</head>
<body>
<header>
  <div>
    <h1>Gustavo Domingueti</h1>
    <div class="headline">${esc(own.headline)}</div>
  </div>
  <div class="contact">
    ${esc(own.location)}<br>
    ${esc(contact.phone)}<br>
    <a href="mailto:${esc(contact.email)}">${esc(contact.email)}</a><br>
    <a href="https://${esc(contact.linkedin)}">${esc(contact.linkedin)}</a><br>
    <a href="https://${esc(contact.github)}">${esc(contact.github)}</a><br>
    <a href="https://${esc(contact.site)}">${esc(contact.site)}</a>
  </div>
</header>

${section(labels.summary, `<div class="indent">${own.summary.map(p => `<p>${esc(p)}</p>`).join('')}</div>`)}
${section(labels.achievements, `<div class="indent">${list(own.achievements)}</div>`)}
${section(labels.experience, jobs)}
${section(
  labels.project,
  entry(
    esc(project.period),
    `<div class="org">${esc(project.title)} <span class="muted">· ${esc(project.url)}</span></div><div class="role">${esc(project.subtitle)}</div>${list(project.points)}<div class="stack"><span>${esc(labels.stack)}:</span> ${esc(project.stack)}</div>`,
  ),
)}
${section(
  labels.skills,
  `<dl class="skills">${own.skills.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl>`,
)}
${section(
  labels.education,
  education.academic.items
    .map(item =>
      entry(
        esc(item.period),
        `<div class="org">${esc(item.course)}</div><div>${esc(item.type)} · ${esc(item.institution)}${item.location ? ` · ${esc(item.location)}` : ''}</div>`,
      ),
    )
    .join(''),
)}
${section(
  labels.courses,
  education.courses.items
    .map(item =>
      entry(
        esc(item.period),
        `<div><b>${esc(item.course)}</b> <span class="muted">· ${esc(item.institution)}</span></div>`,
      ),
    )
    .join('') +
    own.extraCourses
      .map(course => entry('', `<div><b>${esc(course)}</b></div>`))
      .join(''),
)}
${section(
  labels.languages,
  Object.values(messages.Languages.languages)
    .map(lang => entry(esc(lang.level), `<div>${esc(lang.name)}</div>`))
    .join(''),
)}
${section(labels.awards, `<div class="indent">${list(own.awards)}</div>`)}
</body>
</html>`;

  const dir = mkdtempSync(join(tmpdir(), 'cv-'));
  const htmlPath = join(dir, `resume-${locale}.html`);
  writeFileSync(htmlPath, html);
  const out = join(ROOT, 'public', 'cv', `resume-${locale}.pdf`);
  execFileSync(
    CHROME,
    [
      '--headless=new',
      '--disable-gpu',
      '--no-pdf-header-footer',
      `--print-to-pdf=${out}`,
      pathToFileURL(htmlPath).href,
    ],
    { stdio: 'ignore' },
  );
  console.log(`wrote ${out}`);
}

for (const locale of ['en', 'pt']) render(locale);
