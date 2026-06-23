import { useFilter } from './custom-hooks/use-filter';
import type {
  MultiSelectChoice, MultiSelectOptions, Debug_FilterableKeysOf, FilterChoices, FilterStructure, FilterType, Options, RangeChoice,
  RangeOptions, BooleanChoice, BooleanOptions, BooleanFilter, MultiSelectFilter, RangeFilter, SingleSelectChoice,
  SingleSelectOptions, SingleSelectFilter,
} from './custom-hooks/use-filter';
import { useBooleanFilter } from './custom-hooks/use-boolean-filter';
import { useMultiSelectFilter } from './custom-hooks/use-multi-select-filter';
import { useRangeFilter } from './custom-hooks/use-range-filter';
import { useSingleSelectFilter } from './custom-hooks/use-single-select-filter';


export {
  useFilter,

  useBooleanFilter,
  useMultiSelectFilter,
  useRangeFilter,
  useSingleSelectFilter,

  // Export types:
  MultiSelectChoice,
  MultiSelectOptions,
  MultiSelectFilter,
  SingleSelectChoice,
  SingleSelectOptions,
  SingleSelectFilter,
  Debug_FilterableKeysOf,
  FilterChoices,
  FilterStructure,
  FilterType,
  Options,
  RangeChoice,
  RangeOptions,
  RangeFilter,
  BooleanChoice,
  BooleanOptions,
  BooleanFilter,
};
