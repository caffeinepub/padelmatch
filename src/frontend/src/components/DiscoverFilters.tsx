import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CATEGORY_OPTIONS } from '../utils/discoverFilterMappings';
import { URUGUAY_DEPARTMENTS, ALL_DEPARTMENTS } from '../utils/uruguayDepartments';

interface DiscoverFiltersProps {
  minCategory: string;
  maxCategory: string;
  zone: string;
  onMinCategoryChange: (value: string) => void;
  onMaxCategoryChange: (value: string) => void;
  onZoneChange: (value: string) => void;
}

export default function DiscoverFilters({
  minCategory,
  maxCategory,
  zone,
  onMinCategoryChange,
  onMaxCategoryChange,
  onZoneChange,
}: DiscoverFiltersProps) {
  return (
    <div className="space-y-6 py-6">
      {/* Minimum Category */}
      <div className="space-y-2">
        <Label>Categoría mínima</Label>
        <Select value={minCategory} onValueChange={onMinCategoryChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CATEGORY_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Maximum Category */}
      <div className="space-y-2">
        <Label>Categoría máxima</Label>
        <Select value={maxCategory} onValueChange={onMaxCategoryChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CATEGORY_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Zone */}
      <div className="space-y-2">
        <Label>Zona</Label>
        <Select value={zone} onValueChange={onZoneChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_DEPARTMENTS}>{ALL_DEPARTMENTS}</SelectItem>
            {URUGUAY_DEPARTMENTS.map((department) => (
              <SelectItem key={department} value={department}>
                {department}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
