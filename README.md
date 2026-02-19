# React-filter <!-- omit in toc -->
React-filter is a small attribute filter leveraging @material/ui for graphic components.

## Table of content <!-- omit in toc -->
- [Motivation](#motivation)
- [Requirements](#requirements)
- [How to install](#how-to-install)
- [How to use](#how-to-use)
  - [Simple example](#simple-example)
- [API](#api)
  - [Component API](#component-api)
  - [Hook API](#hook-api)
- [Contributing](#contributing)


## Motivation
I needed a lightweight generic way to filter attributes on objects in an efficent manner.  
Lightweight for me means no deep dependencies making upgrading your project complex.  
I built a few components and used them in my own project and once I had a need for it in multiple projects I decided to make a open source lib out of it.

## Requirements
* React >= 19
* @mui/material => 6.4.1

## How to install
```bash
$ npm i @wirdestack/react-filter
```

## How to use

### Simple example
```ts
import { useFilter, FilterChip, FilterSlider, FilterToggle } from '@wirdestack/react-filter';
import type { FilterStructure, ChipOptions, SliderOptions, ToggleChoice } from '@wirdestack/react-filter';

type Product = {
  id: number;
  name: string;
  amount: string;
  brandName: string;
  width: number;
  height: number;
  price: number;
  quickDelivery: boolean;
};
type Products = ReadonlyArray<Product>;

type Params = Readonly<{
  products: Products
}>;

const filterStructure: FilterStructure<Product> = {
  brandName:     { filterType: 'chip', type: 'string', sort: 'asc' },
  width:         { filterType: 'chip', type: 'number', sort: 'desc' },
  height:        { filterType: 'slider' },
  price:         { filterType: 'slider' },
  quickDelivery: { filterType: 'toggle' },
};

export default function ProductsWithFilter({ products }: Params) {
  const [currentFilter, setCurrentFilter] = useState({});
  const { options, filteredItems, availableOptions } = useFilter<Product>(products, filterStructure, currentFilter);

  return <div className="products-with-filter">
    <div className="filter">
      <FilterChip
        label="Brand"
        filterName="brandName"
        options={options['brandName'] as ChipOptions}
        availableOptions={availableOptions['brandName'] as ChipOptions}
        currentFilter={currentFilter}
        filter={(filter) => setCurrentFilter(filter)}
      />
      <FilterChip
        label="Width"
        filterName="width"
        options={options['width'] as ChipOptions}
        availableOptions={availableOptions['width'] as ChipOptions}
        currentFilter={currentFilter}
        filter={(filter) => setCurrentFilter(filter)}
      />
      <FilterSlider
        label="Height"
        filterName="height"
        options={options['height'] as SliderOptions}
        availableOptions={availableOptions['height'] as SliderOptions}
        currentFilter={currentFilter}
        filter={(filter) => setCurrentFilter(filter)}
        unit={'cm'}
      />
      <FilterSlider
        label="Price"
        filterName="price"
        options={options['price'] as SliderOptions}
        availableOptions={availableOptions['price'] as SliderOptions}
        currentFilter={currentFilter}
        filter={(filter) => setCurrentFilter(filter)}
        unit={'€'}
        unitAsPrefix={true}
      />
      <FilterToggle
        label="Only quick delivery"
        filterName="quickDelivery"
        value={currentFilter['quickDelivery'] as ToggleChoice}
        currentFilter={currentFilter}
        filter={(filter) => setCurrentFilter(filter)}
      />
    </div>
    <ProductList products={filteredItems} />
  </div>;
}
```

## API
### Component API
| Component      | Description                                                       |
| -------------- | ----------------------------------------------------------------- |
| FilterChip         | Will render filter for an attribute of the type chip. |
| FilterSlider       | Will render filter for an attribute of the type slider. |
| FilterToggle       | Will render filter for an attribute of the type toggle. |
| FilterChipSkeleton | A placeholder for FilterChip while the page loads if you want less CLS on your site. |
| FilterSliderSkeleton | A placeholder for FilterSlider while the page loads if you want less CLS on your site. |

### Hook API

| Hook             | Description                                                       |
| ---------------- | ----------------------------------------------------------------- |
| useFilter        | Takes the following params: <br />- Array of object to filter. <br />- The filterstructure that defines what to filter on. <br />- Current filter choices.<br /><br />Returns an object with the following:<br />- options: Options that can be filtered on.<br />- filteredItems: The items that matched the current filter.<br />- availableOptions: Where options contains the current selected options, this contains all the available options you can pick. |

## Contributing

Anyone is free to open a PR and contribute to this project... just be civilized!  
Also, please join in on the [discussions](https://github.com/wirdehall/react-filter/discussions), feedback is appreciated.
