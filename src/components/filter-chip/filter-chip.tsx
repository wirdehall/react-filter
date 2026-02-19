import './filter-chip.scoped.scss';

import { Chip } from '@mui/material';
import { ChipChoice, ChipOptions, FilterChoices } from '@src/custom-hooks/use-filter';
import { useCallback, useMemo } from 'react';

type Params = Readonly<{
  filterName: string;
  label: string;
  options: ChipOptions,
  availableOptions: ChipOptions,
  currentFilter: FilterChoices,
  filter: (filter: FilterChoices) => void
}>;

function FilterChip({filterName, label, options, availableOptions, currentFilter, filter}: Params) {
  const indexedFilterChoices = useMemo(() => {
    if(currentFilter[filterName] === undefined) {
      return {};
    }
    return (currentFilter[filterName] as ChipChoice).reduce((acc: { [key: string | number]: true }, choice) => {
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
      let chipChoice = currentFilter[filterName] as ChipChoice;
      if(indexedFilterChoices[option]) {
        chipChoice = chipChoice.filter(item => item !== option);
      } else {
        chipChoice = [ ...chipChoice, option];
      }
      filter({ ...currentFilter, [filterName]: chipChoice });
    }
  }, [currentFilter, filter, filterName, indexedFilterChoices]);

  return (
    <div className="filter">
      <h4>{ label }</h4>
      <div className="filter-options">
        { options.map(option => {
          const isSelected = currentFilter && indexedFilterChoices[option];
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
