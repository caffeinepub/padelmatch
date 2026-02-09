import { Level } from '../backend';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DiscoverFiltersProps {
  filters: {
    levelMin: Level;
    levelMax: Level;
    zone: string;
  };
  onFiltersChange: (filters: { levelMin: Level; levelMax: Level; zone: string }) => void;
}

const URUGUAY_DEPARTMENTS = [
  'Artigas',
  'Canelones',
  'Cerro Largo',
  'Colonia',
  'Durazno',
  'Flores',
  'Florida',
  'Lavalleja',
  'Maldonado',
  'Montevideo',
  'Paysandú',
  'Río Negro',
  'Rivera',
  'Rocha',
  'Salto',
  'San José',
  'Soriano',
  'Tacuarembó',
  'Treinta y Tres',
];

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
        <Select
          value={filters.zone || ''}
          onValueChange={(v) => onFiltersChange({ ...filters, zone: v })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar departamento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos</SelectItem>
            {URUGUAY_DEPARTMENTS.map((dept) => (
              <SelectItem key={dept} value={dept}>
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
