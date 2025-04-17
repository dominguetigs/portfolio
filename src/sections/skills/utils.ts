import { Skill } from './types';

export function sortItems(items: Skill[]) {
  return [...items].sort((a, b) => {
    const aIsFavorite = a.isFavorite;
    const bIsFavorite = b.isFavorite;

    if (aIsFavorite && !bIsFavorite) {
      return -1;
    }

    if (!aIsFavorite && bIsFavorite) {
      return 1;
    }

    const aLevel = a.level || 3;
    const bLevel = b.level || 3;
    return bLevel - aLevel;
  });
}
