import { useCallback, useMemo, useState } from 'react';
import type { FilterChoices, RangeOptions, RangeChoice } from './use-filter';

export function useRangeFilter(params: {
  filterName: string;
  options: RangeOptions;
  currentFilter: FilterChoices;
  filter: (filter: FilterChoices) => void;
}): {
  min: number;
  max: number;
  value: RangeChoice;
  setValue: (next: RangeChoice) => void;  // call while dragging (local only)
  commit: (next?: RangeChoice) => void;   // call on release (writes the filter)
} {
  const { filterName, options, currentFilter, filter } = params;
  const { from: min, to: max } = options;

  const committed = useMemo<RangeChoice>(() => {
    const choice = currentFilter[filterName] as RangeChoice | undefined;
    return choice ?? { from: min, to: max };
  }, [currentFilter, filterName, min, max]);

  const [draft, setDraft] = useState<RangeChoice | null>(null);
  const value = draft ?? committed;

  const setValue = useCallback((next: RangeChoice) => setDraft(next), []);

  const commit = useCallback((next?: RangeChoice) => {
    filter({ ...currentFilter, [filterName]: next ?? value });
    setDraft(null);
  }, [currentFilter, filter, filterName, value]);

  return { min, max, value, setValue, commit };
}
