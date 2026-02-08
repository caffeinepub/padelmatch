import { Level, Position } from '../backend';

export function levelToNumber(level: Level): number {
  switch (level) {
    case Level.one:
      return 1;
    case Level.two:
      return 2;
    case Level.three:
      return 3;
    case Level.four:
      return 4;
    case Level.five:
      return 5;
    default:
      return 3;
  }
}

export function numberToLevel(num: number): Level {
  switch (num) {
    case 1:
      return Level.one;
    case 2:
      return Level.two;
    case 3:
      return Level.three;
    case 4:
      return Level.four;
    case 5:
      return Level.five;
    default:
      return Level.three;
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
