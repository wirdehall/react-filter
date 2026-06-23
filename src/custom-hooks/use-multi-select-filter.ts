import { useCallback, useMemo } from 'react';
import type { FilterChoices, MultiSelectOptions, MultiSelectChoice } from './use-filter';

type MultiSelectControlItem = {
  value: string | number;
  isSelected: boolean;
  isAvailable: boolean;
  toggle: () => void;
};

export function useMultiSelectFilter(params: {
  filterName: string;
  options: MultiSelectOptions;
  availableOptions: MultiSelectOptions;
  currentFilter: FilterChoices;
  filter: (filter: FilterChoices) => void;
}): { items: MultiSelectControlItem[] } {
  const { filterName, options, availableOptions, currentFilter, filter } = params;

  const selected = useMemo(() => {
    const choice = currentFilter[filterName] as MultiSelectChoice | undefined;
    return new Set<string | number>(choice ?? []);
  }, [currentFilter, filterName]);

  const available = useMemo(() => new Set<string | number>(availableOptions), [availableOptions]);

  const toggle = useCallback((option: string | number) => {
    const choice = (currentFilter[filterName] as MultiSelectChoice | undefined) ?? [];
    const next = choice.includes(option)
      ? choice.filter(item => item !== option)
      : [...choice, option];
    filter({ ...currentFilter, [filterName]: next });
  }, [currentFilter, filter, filterName]);

  const items = useMemo<MultiSelectControlItem[]>(() => options.map(option => ({
    value: option,
    isSelected: selected.has(option),
    isAvailable: available.has(option),
    toggle: () => toggle(option),
  })), [options, selected, available, toggle]);

  return { items };
}
