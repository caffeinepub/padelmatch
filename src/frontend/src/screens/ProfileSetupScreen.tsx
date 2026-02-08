import { useState } from 'react';
import { useCreateProfile } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Level, Position } from '../backend';
import { levelToNumber, positionToSpanish } from '../utils/profileMappings';

export default function ProfileSetupScreen() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [level, setLevel] = useState<Level>(Level.three);
  const [position, setPosition] = useState<Position>(Position.drive);
  const [zone, setZone] = useState('');
  const [availability, setAvailability] = useState('');
  const [bio, setBio] = useState('');

  const createProfile = useCreateProfile();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const availabilityArray = availability.split(',').map(s => s.trim()).filter(Boolean);
    
    createProfile.mutate({
      name,
      age: BigInt(age),
      level,
      position,
      zone,
      availability: availabilityArray,
      bio,
    });
  };

  const isValid = name && age && zone && bio;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-950 dark:to-blue-950 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl text-emerald-700 dark:text-emerald-400">
            Completa tu perfil
          </CardTitle>
          <CardDescription>
            Cuéntanos sobre ti para encontrar el compañero perfecto
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Edad *</Label>
                <Input
                  id="age"
                  type="number"
                  min="16"
                  max="99"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="25"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="level">Nivel (1-5) *</Label>
                <Select value={level} onValueChange={(v) => setLevel(v as Level)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={Level.one}>Nivel 1 - Principiante</SelectItem>
                    <SelectItem value={Level.two}>Nivel 2 - Básico</SelectItem>
                    <SelectItem value={Level.three}>Nivel 3 - Intermedio</SelectItem>
                    <SelectItem value={Level.four}>Nivel 4 - Avanzado</SelectItem>
                    <SelectItem value={Level.five}>Nivel 5 - Experto</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">Posición *</Label>
                <Select value={position} onValueChange={(v) => setPosition(v as Position)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={Position.drive}>Drive</SelectItem>
                    <SelectItem value={Position.reves}>Revés</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="zone">Zona *</Label>
                <Input
                  id="zone"
                  value={zone}
                  onChange={(e) => setZone(e.target.value)}
                  placeholder="Ej: Madrid Centro, Barcelona Norte"
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="availability">Disponibilidad</Label>
                <Input
                  id="availability"
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  placeholder="Ej: Lunes tarde, Miércoles mañana (separado por comas)"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="bio">Biografía *</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Cuéntanos sobre tu experiencia en pádel..."
                  rows={4}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={!isValid || createProfile.isPending}
              className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700"
              size="lg"
            >
              {createProfile.isPending ? 'Creando perfil...' : 'Crear Perfil'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
