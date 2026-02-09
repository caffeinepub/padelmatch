import { Level } from '../backend';

// Stable string keys for UI Select components
export type LevelKey = '1' | '2' | '3' | '4' | '5';

/**
 * Convert a Level enum value to a stable string key for UI Select components.
 * Handles various runtime representations (string, enum, object).
 */
export function levelToKey(level: Level): LevelKey {
  // Handle string enum values
  if (typeof level === 'string') {
    switch (level) {
      case 'one':
      case Level.one:
        return '1';
      case 'two':
      case Level.two:
        return '2';
      case 'three':
      case Level.three:
        return '3';
      case 'four':
      case Level.four:
        return '4';
      case 'five':
      case Level.five:
        return '5';
    }
  }
  
  // Handle enum comparison
  if (level === Level.one) return '1';
  if (level === Level.two) return '2';
  if (level === Level.three) return '3';
  if (level === Level.four) return '4';
  if (level === Level.five) return '5';
  
  // Fallback
  return '3';
}

/**
 * Convert a stable string key back to a Level enum value for backend queries.
 */
export function keyToLevel(key: LevelKey): Level {
  switch (key) {
    case '1':
      return Level.one;
    case '2':
      return Level.two;
    case '3':
      return Level.three;
    case '4':
      return Level.four;
    case '5':
      return Level.five;
    default:
      return Level.three;
  }
}
