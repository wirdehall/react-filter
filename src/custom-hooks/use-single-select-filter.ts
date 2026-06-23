import { useCallback, useMemo } from 'react';
import type { FilterChoices, SingleSelectOptions, SingleSelectChoice } from './use-filter';

type SingleSelectControlItem = {
  value: string | number;
  key: string;        // string form, for a native <option value={key}>
  disabled: boolean;
};

export function useSingleSelectFilter(params: {
  filterName: string;
  options: SingleSelectOptions;
  availableOptions: SingleSelectOptions;
  currentFilter: FilterChoices;
  filter: (filter: FilterChoices) => void;
}): { value: string; items: SingleSelectControlItem[]; select: (next: string) => void } {
  const { filterName, options, availableOptions, currentFilter, filter } = params;

  const available = useMemo(() => new Set<string | number>(availableOptions), [availableOptions]);

  const current = currentFilter[filterName] as SingleSelectChoice | undefined;
  const value = current == null ? '' : String(current); // '' = nothing selected

  const items = useMemo<SingleSelectControlItem[]>(() => options.map(option => ({
    value: option,
    key: String(option),
    disabled: !available.has(option),
  })), [options, available]);

  const select = useCallback((next: string) => {
    if (next === '') {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [filterName]: _omit, ...rest } = currentFilter;
      filter(rest);
      return;
    }
    // map the stringified <select> value back to the real option (number or string)
    const match = options.find(option => String(option) === next);
    filter({ ...currentFilter, [filterName]: match ?? next });
  }, [currentFilter, filter, filterName, options]);

  return { value, items, select };
}
