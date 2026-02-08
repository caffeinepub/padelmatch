import { Level } from '../backend';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

interface DiscoverFiltersProps {
  filters: {
    levelMin: Level;
    levelMax: Level;
    zone: string;
  };
  onFiltersChange: (filters: { levelMin: Level; levelMax: Level; zone: string }) => void;
}

export default function DiscoverFilters({ filters, onFiltersChange }: DiscoverFiltersProps) {
  return (
    <div className="space-y-6 py-6">
      <div className="space-y-2">
        <Label>Nivel Mínimo</Label>
        <Select
          value={filters.levelMin}
          onValueChange={(v) => onFiltersChange({ ...filters, levelMin: v as Level })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={Level.one}>Nivel 1</SelectItem>
            <SelectItem value={Level.two}>Nivel 2</SelectItem>
            <SelectItem value={Level.three}>Nivel 3</SelectItem>
            <SelectItem value={Level.four}>Nivel 4</SelectItem>
            <SelectItem value={Level.five}>Nivel 5</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Nivel Máximo</Label>
        <Select
          value={filters.levelMax}
          onValueChange={(v) => onFiltersChange({ ...filters, levelMax: v as Level })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={Level.one}>Nivel 1</SelectItem>
            <SelectItem value={Level.two}>Nivel 2</SelectItem>
            <SelectItem value={Level.three}>Nivel 3</SelectItem>
            <SelectItem value={Level.four}>Nivel 4</SelectItem>
            <SelectItem value={Level.five}>Nivel 5</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Zona</Label>
        <Input
          value={filters.zone}
          onChange={(e) => onFiltersChange({ ...filters, zone: e.target.value })}
          placeholder="Ej: Madrid Centro"
        />
      </div>
    </div>
  );
}
