import {
  activeFilterCount,
  EMPTY_SELECTION,
  selectionToFilters,
  toggle,
} from '../src/utils/searchFilters';

describe('toggle', () => {
  it('adds a value that is missing and removes one that is there', () => {
    expect(toggle(['BMW'], 'Audi')).toEqual(['BMW', 'Audi']);
    expect(toggle(['BMW', 'Audi'], 'BMW')).toEqual(['Audi']);
  });
});

describe('selectionToFilters', () => {
  it('restricts nothing when nothing is chosen', () => {
    expect(selectionToFilters(EMPTY_SELECTION)).toEqual({});
    expect(activeFilterCount(EMPTY_SELECTION)).toBe(0);
  });

  it('passes the chosen fields on, and parses the prices', () => {
    const selection = {
      brands: ['BMW', 'Audi'],
      vendors: ['Hertz'],
      carTypes: [],
      transmission: 'automatic' as const,
      minPrice: ' 300 ',
      maxPrice: '900',
    };

    expect(selectionToFilters(selection)).toEqual({
      brands: ['BMW', 'Audi'],
      vendors: ['Hertz'],
      transmission: 'automatic',
      minPricePerDay: 300,
      maxPricePerDay: 900,
    });
    // brand, vendor, transmission and price - car type is empty
    expect(activeFilterCount(selection)).toBe(4);
  });

  it('ignores a price that is not a whole number of kroner', () => {
    const filters = selectionToFilters({ ...EMPTY_SELECTION, minPrice: 'cheap', maxPrice: '-5' });

    expect(filters).toEqual({});
  });
});
