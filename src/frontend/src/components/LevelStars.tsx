import { Level } from '../backend';
import { Star } from 'lucide-react';
import { levelToNumber } from '../utils/profileMappings';

interface LevelStarsProps {
  level: Level;
  className?: string;
}

export default function LevelStars({ level, className = '' }: LevelStarsProps) {
  const numStars = levelToNumber(level);

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < numStars
              ? 'fill-yellow-400 text-yellow-400'
              : 'fill-gray-300 text-gray-300 dark:fill-gray-600 dark:text-gray-600'
          }`}
        />
      ))}
    </div>
  );
}
