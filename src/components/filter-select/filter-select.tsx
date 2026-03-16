import './filter-select.scoped.scss';

import { MenuItem, Select, SelectProps } from '@mui/material';
import { FilterChoices, SingleSelectChoice, SingleSelectOptions } from '@src/custom-hooks/use-filter';
import { useCallback, useMemo, useState } from 'react';

type Params = Readonly<{
  filterName: string;
  label: string;
  options: SingleSelectOptions,
  availableOptions: SingleSelectOptions,
  currentFilter: FilterChoices,
  filter: (filter: FilterChoices) => void
}> & SelectProps;

function FilterSelect({filterName, label, options, availableOptions, currentFilter, filter, ...selectProps}: Params) {
  const currentValue = useMemo(() => {
    return currentFilter[filterName] ?? '' as SingleSelectChoice;
  }, [currentFilter, filterName, options]);

 const [value, setValue] = useState(currentValue);

   const filterCall = useCallback((value: string | number) => {
    if(value === '') {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [filterName]: _filterVal, ...rest } = currentFilter;
      filter({ ...rest });
    } else {
      filter({ ...currentFilter, [filterName]: value });
    }
     setValue(value);
   }, [currentFilter, filter, filterName]);

  return (
    <div className="filter">
      <h4><span>{ label }</span></h4>
      <Select
        { ...selectProps }
        value={value}
        onChange={(event) => filterCall(event.target.value as string | number)}
      >
        <MenuItem value="">
          <em>-</em>
        </MenuItem>
        { options.map(option => (
          <MenuItem value={option} disabled={!availableOptions.includes(option)}>
            {option}
          </MenuItem>
        )) }
      </Select>
    </div>
  );
}

export default FilterSelect;
