import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CATEGORY_OPTIONS } from '../utils/discoverFilterMappings';
import { URUGUAY_DEPARTMENTS, ALL_DEPARTMENTS } from '../utils/uruguayDepartments';
import { Category } from '../backend';

interface DiscoverFiltersProps {
  minCategory: Category;
  maxCategory: Category;
  zone: string;
  onMinCategoryChange: (value: Category) => void;
  onMaxCategoryChange: (value: Category) => void;
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
    <div className="py-3 px-4 sm:px-6">
      <div className="ml-auto max-w-md space-y-6">
        {/* Minimum Category */}
        <div className="space-y-2">
          <Label>Categoría mínima</Label>
          <Select value={minCategory} onValueChange={(v) => onMinCategoryChange(v as Category)}>
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
          <Select value={maxCategory} onValueChange={(v) => onMaxCategoryChange(v as Category)}>
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
            <SelectContent className="max-h-[60vh] overflow-y-auto">
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
    </div>
  );
}
