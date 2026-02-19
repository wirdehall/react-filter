import './filter-toggle.scoped.scss';

import type { FilterChoices } from '@src/custom-hooks/use-filter';
import { useCallback } from 'react';

type Params = {
  filterName: string;
  label: string;
  value: boolean;
  currentFilter: FilterChoices,
  filter: (filter: FilterChoices) => void
  size?: string;
  stacked?: boolean;
};

export default function FilterToggleButton({filterName, label, value, size, stacked, currentFilter, filter}: Params) {
  const toggleAttribute = useCallback(() => {
    const newFilter = { ...currentFilter };
    if(newFilter[filterName] !== undefined) {
      delete newFilter[filterName];
    } else {
      newFilter[filterName] = true;
    }
    return () => filter(newFilter);
  }, [currentFilter, filter, filterName]);

  return (
    <label className={`toggle ${size}${stacked ? ' stacked' : ''}`}>
      <span className="label">{label}</span>
      <div>
        <input type="checkbox" checked={value} onChange={toggleAttribute} />
        <span className="slider round">
          <div className="handle"></div>
        </span>
      </div>
    </label>
  );
}
