import type { Car } from '../contract';

/** Stands in for the `vehicles` collection while it is superuser-only. */
export const FIXTURE_CARS: Car[] = [
  {
    id: 'fixture-1',
    name: 'Volkswagen Golf',
    vendorName: 'Europcar',
    type: 'Hatchback',
    pricePerDay: 320,
    location: 'Aarhus C',
  },
  {
    id: 'fixture-2',
    name: 'Tesla Model 3',
    vendorName: 'Hertz',
    type: 'Electric',
    pricePerDay: 695,
    location: 'Copenhagen Airport',
  },
  {
    id: 'fixture-3',
    name: 'Toyota Aygo',
    vendorName: 'Sixt',
    type: 'Micro',
    pricePerDay: 210,
    location: 'Odense',
  },
  {
    id: 'fixture-4',
    name: 'Volvo XC60',
    vendorName: 'Avis',
    type: 'SUV',
    pricePerDay: 810,
    location: 'Aalborg',
  },
  {
    id: 'fixture-5',
    name: 'Ford Transit',
    vendorName: 'Europcar',
    type: 'Van',
    pricePerDay: 540,
    location: 'Aarhus N',
  },
];
