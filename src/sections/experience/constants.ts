import positionsData from './positions.json';

/** A month as `YYYY-MM`. */
type YearMonth = `${number}-${number}`;

export type PositionRole = {
  /** Key under Index.Experience.positions.<position>.roles */
  id: string;
  start: YearMonth;
  /** Missing while it is the current role. */
  end?: YearMonth;
};

export type Position = {
  /** Key under Index.Experience.positions */
  id: string;
  location: string;
  /** Newest first. */
  roles: PositionRole[];
  technologies: string[];
};

/**
 * Work history, newest first, as on LinkedIn (2026-11). Dates, places and
 * stacks live in positions.json (scripts/cv reads it too, for the résumés);
 * the words in messages/*.json (Index.Experience.positions).
 */
export const POSITIONS = positionsData as Position[];

/** Shown before "show more". */
export const VISIBLE_POSITIONS = 2;
