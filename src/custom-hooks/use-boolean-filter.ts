import { useCallback } from 'react';
import type { FilterChoices } from './use-filter';

export function useBooleanFilter(params: {
  filterName: string;
  currentFilter: FilterChoices;
  filter: (filter: FilterChoices) => void;
}): { checked: boolean; toggle: () => void } {
  const { filterName, currentFilter, filter } = params;
  const checked = currentFilter[filterName] === true;

  const toggle = useCallback(() => {
    const next = { ...currentFilter };
    if (next[filterName] !== undefined) {
      delete next[filterName];
    } else {
      next[filterName] = true;
    }
    filter(next);
  }, [currentFilter, filter, filterName]);

  return { checked, toggle };
}
