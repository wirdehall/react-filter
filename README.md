# React-filter <!-- omit in toc -->

React-filter is a small, **headless** attribute filter for React. It gives you the filtering
*logic* — derived options, available options, filtered items, and per-filter state — and lets you
bring your own UI. No styling, no component library, no UI dependencies.

> **v3.0.0** removes the previously bundled UI components (`FilterChip`, `FilterSelect`,
> `FilterSlider`, `FilterToggle` and their skeletons) and the `@mui/material` dependency. The library
> is now hooks-only. See [Migrating from 2.x](#migrating-from-2x).

## Table of content <!-- omit in toc -->
- [Motivation](#motivation)
- [Requirements](#requirements)
- [How to install](#how-to-install)
- [How to use](#how-to-use)
  - [Concept](#concept)
  - [Simple example](#simple-example)
- [API](#api)
  - [Hook API](#hook-api)
  - [Types](#types)
- [Migrating from 2.x](#migrating-from-2x)
- [Contributing](#contributing)


## Motivation
I needed a lightweight generic way to filter attributes on objects in an efficient manner.
Lightweight for me means no deep dependencies making upgrading your project complex.
Going headless takes that to its conclusion: the library ships only the logic, so it carries no UI
dependencies at all and you render the filters with whatever components your project already uses.

## Requirements
* React >= 19

## How to install
```bash
npm i @wirdestack/react-filter
```

## How to use

### Concept

1. Describe your data with a `FilterStructure` — one entry per filterable attribute, each declaring
   its `filterType` (`multi-select`, `single-select`, `range` or `boolean`).
2. Call `useFilter(items, filterStructure, currentFilter)` to get:
   - `filteredItems` — the items matching the current selection,
   - `options` — every value that can be filtered on per attribute,
   - `availableOptions` — the values that still yield results given the current selection.
3. Render each filter with its per-type hook (`useMultiSelectFilter`, `useSingleSelectFilter`,
   `useRangeFilter`, `useBooleanFilter`) wired to your own components. Because hooks can't be called
   in a loop, give each filter its own small component.

The per-type hooks all take `currentFilter` and a `filter` callback (call it with the next
`FilterChoices` to apply a change), and return ready-to-render state plus handlers.

### Simple example

Top-level wiring with `useFilter`:

```tsx
import { useState } from 'react';
import {
  useFilter,
  type FilterStructure,
  type FilterChoices,
  type MultiSelectOptions,
  type SingleSelectOptions,
  type RangeOptions,
} from '@wirdestack/react-filter';

type Product = {
  id: number;
  name: string;
  color: string;
  brandName: string;
  width: number;
  price: number;
  quickDelivery: boolean;
};

const filterStructure: FilterStructure<Product> = {
  color:         { filterType: 'single-select', valueType: 'string', sort: 'asc' },
  brandName:     { filterType: 'multi-select', valueType: 'string', sort: 'asc' },
  width:         { filterType: 'multi-select', valueType: 'number', sort: 'desc' },
  price:         { filterType: 'range', unit: '€' },
  quickDelivery: { filterType: 'boolean' },
};

export default function ProductsWithFilter({ products }: { products: ReadonlyArray<Product> }) {
  const [currentFilter, setCurrentFilter] = useState<FilterChoices>({});
  const { options, filteredItems, availableOptions } = useFilter(products, filterStructure, currentFilter);

  return (
    <div className="products-with-filter">
      <div className="filter">
        <SingleSelectFilter
          label="Color" filterName="color"
          options={options.color as SingleSelectOptions}
          availableOptions={availableOptions.color as SingleSelectOptions}
          currentFilter={currentFilter} filter={setCurrentFilter}
        />
        <MultiSelectFilter
          label="Brand" filterName="brandName"
          options={options.brandName as MultiSelectOptions}
          availableOptions={availableOptions.brandName as MultiSelectOptions}
          currentFilter={currentFilter} filter={setCurrentFilter}
        />
        <RangeFilter
          label="Price" filterName="price" unit="€"
          options={options.price as RangeOptions}
          currentFilter={currentFilter} filter={setCurrentFilter}
        />
        <BooleanFilter
          label="Only quick delivery" filterName="quickDelivery"
          currentFilter={currentFilter} filter={setCurrentFilter}
        />
      </div>
      <ProductList products={filteredItems} />
    </div>
  );
}
```

The four filter components, rendered with plain HTML — swap in your own design system as you like.
Each is a thin wrapper around one hook:

```tsx
import {
  useMultiSelectFilter,
  useSingleSelectFilter,
  useRangeFilter,
  useBooleanFilter,
  type FilterChoices,
  type MultiSelectOptions,
  type SingleSelectOptions,
  type RangeOptions,
} from '@wirdestack/react-filter';

type Base = {
  label: string;
  filterName: string;
  currentFilter: FilterChoices;
  filter: (next: FilterChoices) => void;
};

// multi-select → a row of toggle buttons
function MultiSelectFilter({ label, filterName, options, availableOptions, currentFilter, filter }:
  Base & { options: MultiSelectOptions; availableOptions: MultiSelectOptions }) {
  const { items } = useMultiSelectFilter({ filterName, options, availableOptions, currentFilter, filter });
  return (
    <fieldset>
      <legend>{label}</legend>
      {items.map(({ value, isSelected, isAvailable, toggle }) => (
        <button
          key={value}
          type="button"
          aria-pressed={isSelected}
          disabled={!isAvailable && !isSelected}
          onClick={toggle}
        >
          {value}
        </button>
      ))}
    </fieldset>
  );
}

// single-select → a native <select> (empty value clears the filter)
function SingleSelectFilter({ label, filterName, options, availableOptions, currentFilter, filter }:
  Base & { options: SingleSelectOptions; availableOptions: SingleSelectOptions }) {
  const { value, items, select } = useSingleSelectFilter({ filterName, options, availableOptions, currentFilter, filter });
  return (
    <label>
      {label}
      <select value={value} onChange={(event) => select(event.target.value)}>
        <option value="">All</option>
        {items.map(({ value, key, disabled }) => (
          <option key={key} value={value} disabled={disabled}>{value}</option>
        ))}
      </select>
    </label>
  );
}

// range → two number inputs. `setValue` updates a local draft (for live dragging); `commit`
// writes it to the filter — call it on release/blur so you don't re-filter on every keystroke.
function RangeFilter({ label, filterName, options, unit, currentFilter, filter }:
  Base & { options: RangeOptions; unit?: string }) {
  const { min, max, value, setValue, commit } = useRangeFilter({ filterName, options, currentFilter, filter });
  return (
    <fieldset>
      <legend>{unit ? `${label} (${unit})` : label}</legend>
      <input
        type="number" min={min} max={max} value={value.from}
        onChange={(event) => setValue({ ...value, from: Number(event.target.value) })}
        onBlur={() => commit()}
      />
      <input
        type="number" min={min} max={max} value={value.to}
        onChange={(event) => setValue({ ...value, to: Number(event.target.value) })}
        onBlur={() => commit()}
      />
    </fieldset>
  );
}

// boolean → a checkbox
function BooleanFilter({ label, filterName, currentFilter, filter }: Base) {
  const { checked, toggle } = useBooleanFilter({ filterName, currentFilter, filter });
  return (
    <label>
      <input type="checkbox" checked={checked} onChange={toggle} />
      {label}
    </label>
  );
}
```

> `filterType` describes filter *behaviour*, not a UI. `multi-select` is shown above as toggle
> buttons, but nothing stops you from rendering it as a dropdown, a list of checkboxes, or anything
> else — the hooks are small and unopinionated.

## API

### Hook API

#### `useFilter<T>(items, filterStructure, currentFilter)`
The core hook. Pass your items, the `FilterStructure`, and the current `FilterChoices`.

Returns:
- `filteredItems: T[]` — the items matching `currentFilter`.
- `options: Options` — every filterable value per attribute.
- `availableOptions: Options` — the subset of `options` that still returns results given the current
  selection (use it to disable/grey out dead-end choices).

#### `useMultiSelectFilter({ filterName, options, availableOptions, currentFilter, filter })`
Returns `{ items }`, where each item is `{ value, isSelected, isAvailable, toggle() }`. Call
`toggle()` to add/remove that value from the selection.

#### `useSingleSelectFilter({ filterName, options, availableOptions, currentFilter, filter })`
Returns:
- `value: string` — the current selection as a string (`''` when nothing is selected).
- `items: { value, key, disabled }[]` — `key` is the stringified value for a native `<option>`;
  `disabled` is `true` when the value isn't currently available.
- `select(next: string)` — set the selection; pass `''` to clear it.

#### `useRangeFilter({ filterName, options, currentFilter, filter })`
Returns:
- `min`, `max` — the bounds (from the filter's `options`).
- `value: { from, to }` — the current (draft-or-committed) range.
- `setValue(next)` — update a **local draft** only (use while dragging for a live preview).
- `commit(next?)` — **write** the range to the filter (call on release); with no argument it commits
  the current draft.

#### `useBooleanFilter({ filterName, currentFilter, filter })`
Returns `{ checked, toggle() }`. `toggle()` flips the boolean filter on/off.

### Types

- `FilterStructure<T>` — `{ [K in filterable keys of T]?: FilterType }`. Use
  `Debug_FilterableKeysOf<T>` if you're unsure which keys are allowed.
- `FilterType` — one of:
  - `MultiSelectFilter` — `{ filterType: 'multi-select'; valueType: 'string' | 'number'; sort?: 'asc' | 'desc' }`
  - `SingleSelectFilter` — `{ filterType: 'single-select'; valueType: 'string' | 'number'; sort?: 'asc' | 'desc' }`
  - `RangeFilter` — `{ filterType: 'range'; unit?: string }` (`unit` is metadata for your UI to display)
  - `BooleanFilter` — `{ filterType: 'boolean' }`
- `Options` / `MultiSelectOptions` / `SingleSelectOptions` / `RangeOptions` (`{ from, to }`) — the
  shapes returned in `options` / `availableOptions` per filter type.
- `FilterChoices` — the current-selection object you keep in state, keyed by `filterName`. Per-type
  choices are `MultiSelectChoice`, `SingleSelectChoice`, `RangeChoice` and `BooleanChoice`.

## Migrating from 2.x

The bundled components are gone; render your own UI with the matching hook:

| 2.x component (removed) | 3.0.0 hook              |
| ----------------------- | ----------------------- |
| `FilterChip`            | `useMultiSelectFilter`  |
| `FilterSelect`          | `useSingleSelectFilter` |
| `FilterSlider`          | `useRangeFilter`        |
| `FilterToggle`          | `useBooleanFilter`      |
| `FilterChipSkeleton` / `FilterSliderSkeleton` | render your own loading placeholder |

Other changes:
- **`@mui/material` is no longer a dependency** — you supply the UI.
- The `--react-filter-*` CSS variables (`--react-filter-distance`, `--react-filter-color`, etc.) and
  the `--react-filter-yes` / `--react-filter-no` toggle labels are gone — styling and copy now live
  entirely in your own components.
- `useFilter`, the `FilterStructure`, `options` / `availableOptions` / `filteredItems`, and the
  `currentFilter` shape are unchanged, so your data wiring carries over as-is.

See [Simple example](#simple-example) for drop-in replacements you can copy and restyle.

## Contributing

Anyone is free to open a PR and contribute to this project... just be civilized!
Also, please join in on the [discussions](https://github.com/wirdehall/react-filter/discussions), feedback is appreciated.
