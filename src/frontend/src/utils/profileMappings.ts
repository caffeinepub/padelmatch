import { Category, Position } from '../backend';

export function categoryToLabel(category: Category): string {
  switch (category) {
    case Category.first:
      return '1era';
    case Category.second:
      return '2da';
    case Category.third:
      return '3era';
    case Category.fourth:
      return '4ta';
    case Category.fifth:
      return '5ta';
    case Category.sixth:
      return '6ta';
    case Category.seventh:
      return '7ma';
    default:
      return '3era';
  }
}

export function positionToSpanish(position: Position): string {
  switch (position) {
    case Position.drive:
      return 'Drive';
    case Position.reves:
      return 'Revés';
    default:
      return 'Drive';
  }
}
