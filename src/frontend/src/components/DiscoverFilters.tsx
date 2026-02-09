import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LevelKey } from '../utils/discoverFilterMappings';

interface DiscoverFiltersProps {
  levelMin: LevelKey;
  levelMax: LevelKey;
  zone: string;
  onLevelMinChange: (key: LevelKey) => void;
  onLevelMaxChange: (key: LevelKey) => void;
  onZoneChange: (zone: string) => void;
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

export default function DiscoverFilters({
  levelMin,
  levelMax,
  zone,
  onLevelMinChange,
  onLevelMaxChange,
  onZoneChange,
}: DiscoverFiltersProps) {
  return (
    <div className="space-y-6 py-6">
      <div className="space-y-2">
        <Label>Nivel Mínimo</Label>
        <Select value={levelMin} onValueChange={(v) => onLevelMinChange(v as LevelKey)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Nivel 1</SelectItem>
            <SelectItem value="2">Nivel 2</SelectItem>
            <SelectItem value="3">Nivel 3</SelectItem>
            <SelectItem value="4">Nivel 4</SelectItem>
            <SelectItem value="5">Nivel 5</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Nivel Máximo</Label>
        <Select value={levelMax} onValueChange={(v) => onLevelMaxChange(v as LevelKey)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Nivel 1</SelectItem>
            <SelectItem value="2">Nivel 2</SelectItem>
            <SelectItem value="3">Nivel 3</SelectItem>
            <SelectItem value="4">Nivel 4</SelectItem>
            <SelectItem value="5">Nivel 5</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Zona</Label>
        <Select value={zone} onValueChange={onZoneChange}>
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
