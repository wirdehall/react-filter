import { Skeleton } from "@mui/material";

import './filter-slider.scoped.scss';

type Params = Readonly<{
  numberOfChips: number;
}>;

const FilterSliderSkeleton =({numberOfChips}: Params) => (
  <div className="filter">
    <h4><Skeleton variant="rounded" height={25} /></h4>
    <div className="filter-options">
      { Array(numberOfChips).fill(0).map((_val, index) => (<Skeleton variant="rounded" height={32} key={index} />))}
    </div>
  </div>
);

export default FilterSliderSkeleton;
