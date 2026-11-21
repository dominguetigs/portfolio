import type { PositionRole } from './constants';

/**
 * "Out 2026", from fixed month names in the messages: Intl would give
 * "out. de 2026", and its output can differ between the server and the browser.
 */
export function formatMonth(yearMonth: string, months: string[]) {
  const [year, month] = yearMonth.split('-').map(Number);
  return `${months[month - 1]} ${year}`;
}

export function formatPeriod(
  start: string,
  end: string | undefined,
  months: string[],
  present: string,
) {
  return `${formatMonth(start, months)} – ${end ? formatMonth(end, months) : present}`;
}

/** The whole time at a company: from its first role to its last. */
export function companyPeriod(roles: PositionRole[]) {
  const starts = roles.map(r => r.start).sort();
  const current = roles.some(r => !r.end);
  const ends = roles.map(r => r.end ?? '').sort();
  return { start: starts[0], end: current ? undefined : ends[ends.length - 1] };
}
