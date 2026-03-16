import './filter-chip.scoped.scss';

import { Chip } from '@mui/material';
import { MultiSelectChoice, MultiSelectOptions, FilterChoices } from '@src/custom-hooks/use-filter';
import { useCallback, useMemo } from 'react';

type Params = Readonly<{
  filterName: string;
  label: string;
  options: MultiSelectOptions,
  availableOptions: MultiSelectOptions,
  currentFilter: FilterChoices,
  filter: (filter: FilterChoices) => void
}>;

function FilterChip({filterName, label, options, availableOptions, currentFilter, filter}: Params) {
  const indexedFilterChoices = useMemo(() => {
    if(currentFilter[filterName] === undefined) {
      return {};
    }
    return (currentFilter[filterName] as MultiSelectChoice).reduce((acc: { [key: string | number]: true }, choice) => {
      acc[choice] = true;
      return acc;
    }, {});
  }, [currentFilter, filterName]);

  const indexedAvailableOptions = useMemo(() => {
    return availableOptions.reduce((acc: { [key: string | number]: true }, option) => {
      acc[option] = true;
      return acc;
    }, {});
  }, [availableOptions]);

  const isAvailable = useCallback((option: string | number) => {
    return indexedAvailableOptions[option];
  }, [indexedAvailableOptions]);

  const filterCall = useCallback((option: string | number) => {
    if(currentFilter[filterName] === undefined) {
      filter({ ...currentFilter, [filterName]: [option] });
    } else {
      let multiSelectChoice = currentFilter[filterName] as MultiSelectChoice;
      if(indexedFilterChoices[option]) {
        multiSelectChoice = multiSelectChoice.filter(item => item !== option);
      } else {
        multiSelectChoice = [ ...multiSelectChoice, option];
      }
      filter({ ...currentFilter, [filterName]: multiSelectChoice });
    }
  }, [currentFilter, filter, filterName, indexedFilterChoices]);

  return (
    <div className="filter">
      <h4><span>{ label }</span></h4>
      <div className="filter-options">
        { options.map(option => {
          const isSelected = indexedFilterChoices[option];
          const variant = isSelected || !isAvailable(option) ? 'filled' : 'outlined';
          return (
            <Chip
              key={option}
              label={option}
              color={ isSelected || isAvailable(option) ? 'primary' : 'default' }
              variant={variant}
              onClick={() => filterCall(option)}
            />
          );
        })}
      </div>
    </div>
  );
}

export default FilterChip;
