import './filter-slider.scoped.scss';

import { Slider } from '@mui/material';
import { useCallback, useMemo, useState } from 'react';
import { FilterChoices, SliderChoice, SliderOptions } from '@src/custom-hooks/use-filter';

type Params = Readonly<{
  filterName: string;
  label: string;
  options: SliderOptions;
  availableOptions: SliderOptions,
  currentFilter: FilterChoices;
  filter: (filter: FilterChoices) => void;
  unit: string;
  unitAsPrefix?: boolean
}>;

function FilterSlider({filterName, label, options, currentFilter, filter, unit, unitAsPrefix}: Params) {
  const currentValue = useMemo(() => {
    const current = currentFilter[filterName] as SliderChoice;
    return currentFilter[filterName] !== undefined ? [current.from, current.to] : [options.from, options.to];
  }, [currentFilter, filterName, options]);

  const [value, setValue] = useState(currentValue);

  const filterCall = useCallback((value: Array<number>) => {
    filter({ ...currentFilter, [filterName]: { from: value[0], to: value[1] } });
    setValue(value);
  }, [currentFilter, filter, filterName]);

  return (
    <div className="filter">
      <h4>{ label }</h4>
      <div className="filter-options">
        <div className='min-max-labels'>
          <div className='min'>{options.from} {unit}</div>
          <div className='max'>{options.to} {unit}</div>
        </div>
        <div className='slider'>
          <Slider
            min={options.from}
            max={options.to}
            value={value}
            onChangeCommitted={(_event, value) => filterCall(value as Array<number>)}
            onChange={(_event, value) => setValue(value as Array<number>)}
            valueLabelFormat={(value: number) => unitAsPrefix ? `${unit} ${value}` : `${value} ${unit}`}
            valueLabelDisplay="auto"
            disableSwap
          />
        </div>
      </div>
    </div>
  );
}

export default FilterSlider;
