import { Category } from '../backend';

// Category options for min/max category filters (1era through 7ma)
// Using backend Category enum values with Spanish labels
export const CATEGORY_OPTIONS = [
  { value: Category.first, label: '1era' },
  { value: Category.second, label: '2da' },
  { value: Category.third, label: '3era' },
  { value: Category.fourth, label: '4ta' },
  { value: Category.fifth, label: '5ta' },
  { value: Category.sixth, label: '6ta' },
  { value: Category.seventh, label: '7ma' },
] as const;
