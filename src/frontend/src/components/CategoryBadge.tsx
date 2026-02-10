import { Category } from '../backend';
import { Badge } from '@/components/ui/badge';
import { categoryToLabel } from '../utils/profileMappings';

interface CategoryBadgeProps {
  category: Category;
  className?: string;
}

export default function CategoryBadge({ category, className = '' }: CategoryBadgeProps) {
  const label = categoryToLabel(category);

  return (
    <Badge 
      variant="secondary" 
      className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold ${className}`}
    >
      {label}
    </Badge>
  );
}
