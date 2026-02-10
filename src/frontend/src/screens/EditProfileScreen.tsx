import { useState } from 'react';
import { useUpdateProfile } from '../hooks/useQueries';
import { Profile, Category, Position } from '../backend';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

interface EditProfileScreenProps {
  profile: Profile;
  onBack: () => void;
}

export default function EditProfileScreen({ profile, onBack }: EditProfileScreenProps) {
  const [name, setName] = useState(profile.name);
  const [age, setAge] = useState(Number(profile.age).toString());
  const [category, setCategory] = useState<Category>(profile.category);
  const [position, setPosition] = useState<Position>(profile.position);
  const [zone, setZone] = useState(profile.zone);
  const [availability, setAvailability] = useState(profile.availability.join(', '));
  const [bio, setBio] = useState(profile.bio);

  const updateProfile = useUpdateProfile();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const availabilityArray = availability.split(',').map((s) => s.trim()).filter(Boolean);

    updateProfile.mutate(
      {
        name,
        age: BigInt(age),
        category,
        position,
        zone,
        availability: availabilityArray,
        bio,
      },
      {
        onSuccess: () => onBack(),
      }
    );
  };

  return (
    <div className="container max-w-2xl mx-auto px-4 py-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <CardTitle className="text-2xl text-emerald-700 dark:text-emerald-400">
              Editar Perfil
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Edad</Label>
                <Input
                  id="age"
                  type="number"
                  min="16"
                  max="99"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Categoría (1era–7ma)</Label>
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
                <Label htmlFor="position">Posición</Label>
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
                <Label htmlFor="zone">Zona</Label>
                <Input
                  id="zone"
                  value={zone}
                  onChange={(e) => setZone(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="availability">Disponibilidad</Label>
                <Input
                  id="availability"
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  placeholder="Separado por comas"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="bio">Biografía</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  required
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={onBack} className="flex-1">
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={updateProfile.isPending}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700"
              >
                {updateProfile.isPending ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
