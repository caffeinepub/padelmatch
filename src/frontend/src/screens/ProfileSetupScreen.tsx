import { useState } from 'react';
import { useCreateProfile } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Category, Position } from '../backend';
import { URUGUAY_DEPARTMENTS, ALL_DEPARTMENTS } from '../utils/uruguayDepartments';

export default function ProfileSetupScreen() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [category, setCategory] = useState<Category>(Category.third);
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
      category,
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
                <Label htmlFor="category">Categoría (1era–7ma) *</Label>
                <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={Category.first}>1era</SelectItem>
                    <SelectItem value={Category.second}>2da</SelectItem>
                    <SelectItem value={Category.third}>3era</SelectItem>
                    <SelectItem value={Category.fourth}>4ta</SelectItem>
                    <SelectItem value={Category.fifth}>5ta</SelectItem>
                    <SelectItem value={Category.sixth}>6ta</SelectItem>
                    <SelectItem value={Category.seventh}>7ma</SelectItem>
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
                <Select value={zone} onValueChange={setZone}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona tu departamento" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px] overflow-y-auto">
                    <SelectItem value={ALL_DEPARTMENTS}>{ALL_DEPARTMENTS}</SelectItem>
                    {URUGUAY_DEPARTMENTS.map((department) => (
                      <SelectItem key={department} value={department}>
                        {department}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
