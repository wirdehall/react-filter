import { sortStringOrNumber } from "../helpers/sort.helper";
import { Writeable } from "../helpers/typescript.helper";
import { useMemo } from "react";

// Primitive values allowed for filtering
type FilterablePrimitive = string | number | boolean;

// Only allow keys that are filterable
type FilterableKeys<T> = {
  [K in keyof T]: T[K] extends FilterablePrimitive ? K : never;
}[keyof T];

/**
 * Use this helper if you're unsure which keys are allowed in FilterStructure.
 * Use like this: type AllowedFilterKeys = Debug_FilterableKeysOf<Product>;
 */
export type Debug_FilterableKeysOf<T> = FilterableKeys<T>;

export type FilterType =
  | { filterType: 'chip'; type: 'string' | 'number'; sort?: 'asc' | 'desc' }
  | { filterType: 'slider' }
  | { filterType: 'toggle' };

export type FilterStructure<T> = Readonly<{
  [K in FilterableKeys<T>]?: FilterType;
}>;

export type ChipOptions = ReadonlyArray<string | number>;
export type SliderOptions = Readonly<{ from: number; to: number; }>;
export type ToggleOptions = null;

export type Options = {
  [name: string]: ChipOptions | SliderOptions | ToggleOptions;
};

export type ChipChoice = ReadonlyArray<string | number>;
export type SliderChoice = { from: number; to: number; };
export type ToggleChoice = true | false;

type FilterChoicesInternal<T> = Readonly<{
  [K in FilterableKeys<T>]?: ChipChoice | SliderChoice | ToggleChoice;
}>;

export type FilterChoices = Readonly<{
  [name: string]: ChipChoice | SliderChoice | ToggleChoice;
}>;

type IndexedChipChoice = { [key: string | number]: true };
type IndexedFilterChoices<T> = {
  [K in FilterableKeys<T>]?: IndexedChipChoice | SliderChoice | ToggleChoice;
};

export const useFilter = <T extends Record<string, unknown>>(
  items: ReadonlyArray<T>,
  filterStructure: FilterStructure<T>,
  filterChoices: FilterChoicesInternal<T>,
) => {
  const options = useGetOptions<T>(items, filterStructure);
  const filterChoicesIndex = useGetFilterChoicesIndex<T>(filterStructure, filterChoices);
  const filteredItems = useGetFilteredItems(items, filterStructure, filterChoicesIndex);
  const availableOptions = useGetAvailableOptions(items, filterStructure, filterChoicesIndex);
  return { options, filteredItems, availableOptions };
};

const useGetAvailableOptions = <T extends Record<string, unknown>>(
  items: ReadonlyArray<T>,
  filterStructure: FilterStructure<T>,
  filterChoicesIndex: IndexedFilterChoices<T>
) => {
  return useMemo(() => {
    const availableOptions: Options = {};

    for (const key of Object.keys(filterStructure)) {
      const typedKey = key as FilterableKeys<T>;

      const tempFilterChoice = { ...filterChoicesIndex };
      delete tempFilterChoice[typedKey];

      const tempItems = getFilteredItems(items, filterStructure, tempFilterChoice);
      const option = getOptionForKey(tempItems, typedKey, filterStructure[typedKey] as FilterType);
      if (option !== undefined) {
        availableOptions[key] = option;
      }
    }

    return availableOptions;
  }, [filterChoicesIndex, filterStructure, items]);
};

const getOptionForKey = <T extends Record<string, unknown>>(
  items: ReadonlyArray<T>,
  key: FilterableKeys<T>,
  type: FilterType,
) => {
  if (type.filterType === 'chip') {
    const values = items.map(item => item[key]) as Array<string | number>;
    const sortDirection = type.sort === undefined ? true : type.sort === 'asc';
    return ([...new Set(values)] as Writeable<ChipOptions>).sort((a, b) => sortStringOrNumber(a, b, type.type, sortDirection));
  } else if (type.filterType === 'slider') {
    if (items.length === 0) {
      return { from: 0, to: 0 };
    } else {
      const numericValues = items.map(item => Number(item[key])).filter(val => !isNaN(val));
      const min = Math.min(...numericValues);
      const max = Math.max(...numericValues);
      return { from: min, to: max };
    }
  } else if (type.filterType === 'toggle') {
    return null;
  }
};

const getOptions = <T extends Record<string, unknown>>(
  items: ReadonlyArray<T>,
  filterStructure: FilterStructure<T>
) => {
  return Object.entries(filterStructure).reduce((acc, [key, type]) => {
    const option = getOptionForKey(items, key as FilterableKeys<T>, type as FilterType);
    if (option !== undefined) {
      acc[key] = option;
    }
    return acc;
  }, {} as Options);
};

const useGetOptions = <T extends Record<string, unknown>>(
  items: ReadonlyArray<T>,
  filterStructure: FilterStructure<T>
) => {
  return useMemo(() => {
    return getOptions(items, filterStructure);
  }, [filterStructure, items]);
};

const useGetFilterChoicesIndex = <T extends Record<string, unknown>>(
  filterStructure: FilterStructure<T>,
  filterChoices: FilterChoicesInternal<T>
) => {
  return useMemo(() => {
    return Object.entries(filterChoices).reduce((acc: IndexedFilterChoices<T>, [key, choices]) => {
      if (filterStructure[key as FilterableKeys<T>]?.filterType === 'chip') {
        if ((choices as ChipChoice).length !== 0) {
          acc[key as FilterableKeys<T>] = (choices as ChipChoice).reduce((indexedChipChoice: Writeable<IndexedChipChoice>, value) => {
            indexedChipChoice[value] = true;
            return indexedChipChoice;
          }, {});
        }
      } else {
        acc[key as FilterableKeys<T>] = choices as SliderChoice | ToggleChoice;
      }
      return acc;
    }, {});
  }, [filterChoices, filterStructure]);
};

const useGetFilteredItems = <T extends Record<string, unknown>>(
  items: ReadonlyArray<T>,
  filterStructure: FilterStructure<T>,
  filterChoicesIndex: IndexedFilterChoices<T>
) => {
  return useMemo(() => getFilteredItems(items, filterStructure, filterChoicesIndex), [filterChoicesIndex, filterStructure, items]);
};

const getFilteredItems = <T extends Record<string, unknown>>(
  items: ReadonlyArray<T>,
  filterStructure: FilterStructure<T>,
  filterChoicesIndex: IndexedFilterChoices<T>
) => {
  return items.filter((item) => {
    for (const [key, choice] of Object.entries(filterChoicesIndex)) {
      const filter = filterStructure[key as FilterableKeys<T>];
      if (filter === undefined || choice === undefined) {
        return true; // Ignore filter values that does not exist in the FilterStructure
      }
      if (filter.filterType === 'chip') {
        const value = item[key] as  string | number;
        if ((choice as IndexedChipChoice)[value] !== true) {
          return false;
        }
      } else if (filter.filterType === 'slider') {
        const value = item[key] as number;
        if ((choice as SliderChoice).from > value || (choice as SliderChoice).to < value) {
          return false;
        }
      } else if (filter.filterType === 'toggle') {
        const value = item[key] as boolean;
        if ((choice as ToggleChoice) !== value) {
          return false;
        }
      }
    }
    return true;
  });
};
