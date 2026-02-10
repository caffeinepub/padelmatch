import { useState } from 'react';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import UserAvatar from '../components/UserAvatar';
import CategoryBadge from '../components/CategoryBadge';
import EditProfileScreen from './EditProfileScreen';
import ProfilePhotoUploader from '../components/ProfilePhotoUploader';
import { positionToSpanish } from '../utils/profileMappings';
import { MapPin, Edit } from 'lucide-react';

export default function ProfileScreen() {
  const { data: profile, isLoading } = useGetCallerUserProfile();
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing && profile) {
    return <EditProfileScreen profile={profile} onBack={() => setIsEditing(false)} />;
  }

  if (isLoading || !profile) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-emerald-700 dark:text-emerald-400">Mi Perfil</h1>
        <Button onClick={() => setIsEditing(true)} variant="outline">
          <Edit className="h-4 w-4 mr-2" />
          Editar
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="relative h-64 bg-gradient-to-br from-emerald-100 to-blue-100 dark:from-emerald-900 dark:to-blue-900">
          <UserAvatar photo={profile.photo} name={profile.name} className="w-full h-full object-cover" />
          <div className="absolute bottom-4 right-4">
            <ProfilePhotoUploader />
          </div>
        </div>

        <CardContent className="p-6 space-y-6">
          <div>
            <h2 className="text-2xl font-bold">{profile.name}</h2>
            <p className="text-muted-foreground">{Number(profile.age)} años</p>
          </div>

          <div className="flex items-center gap-2">
            <CategoryBadge category={profile.category} />
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white">
              {positionToSpanish(profile.position)}
            </Badge>
            <Badge variant="secondary">
              <MapPin className="h-3 w-3 mr-1" />
              {profile.zone}
            </Badge>
          </div>

          {profile.bio && (
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground mb-2">Biografía</h3>
              <p className="text-sm">{profile.bio}</p>
            </div>
          )}

          {profile.availability.length > 0 && (
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground mb-2">Disponibilidad</h3>
              <div className="flex flex-wrap gap-2">
                {profile.availability.map((slot, i) => (
                  <Badge key={i} variant="outline">
                    {slot}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {Number(profile.matchesPlayed)}
              </p>
              <p className="text-sm text-muted-foreground">Partidos</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {Number(profile.wins)}
              </p>
              <p className="text-sm text-muted-foreground">Victorias</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
