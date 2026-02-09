import { Principal } from '@dfinity/principal';
import { useGetUserProfile } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, MapPin, AlertCircle, RefreshCw } from 'lucide-react';
import UserAvatar from '../components/UserAvatar';
import LevelStars from '../components/LevelStars';
import { positionToSpanish } from '../utils/profileMappings';

interface MatchProfileScreenProps {
  userId: Principal;
  onBack: () => void;
}

export default function MatchProfileScreen({ userId, onBack }: MatchProfileScreenProps) {
  const { data: profile, isLoading, error, refetch } = useGetUserProfile(userId);

  if (isLoading) {
    return (
      <div className="flex flex-col h-full bg-white dark:bg-gray-900">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b bg-white dark:bg-gray-900 shadow-sm">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">Perfil</h1>
        </div>

        {/* Loading Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-2xl mx-auto space-y-6">
            <Card className="overflow-hidden">
              <div className="relative aspect-[3/4] bg-gradient-to-br from-emerald-100 to-blue-100 dark:from-emerald-900 dark:to-blue-900">
                <Skeleton className="w-full h-full" />
              </div>
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-full bg-white dark:bg-gray-900">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b bg-white dark:bg-gray-900 shadow-sm">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">Perfil</h1>
        </div>

        {/* Error Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-2xl mx-auto">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>Error al cargar el perfil</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetch()}
                  className="ml-2"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Reintentar
                </Button>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col h-full bg-white dark:bg-gray-900">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b bg-white dark:bg-gray-900 shadow-sm">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">Perfil</h1>
        </div>

        {/* Not Available Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center py-12 space-y-4">
              <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mx-auto">
                <AlertCircle className="h-10 w-10 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xl font-semibold text-muted-foreground">Perfil no disponible</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Este perfil no está disponible en este momento
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-950 dark:to-blue-950">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b bg-white dark:bg-gray-900 shadow-sm">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold">Perfil de {profile.name}</h1>
      </div>

      {/* Profile Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <Card className="overflow-hidden shadow-xl rounded-3xl border-2">
            <div className="relative aspect-[3/4] bg-gradient-to-br from-emerald-100 to-blue-100 dark:from-emerald-900 dark:to-blue-900">
              <UserAvatar
                photo={profile.photo}
                name={profile.name}
                className="w-full h-full object-cover"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white space-y-3">
                <div>
                  <h2 className="text-3xl font-bold">{profile.name}</h2>
                  <p className="text-lg opacity-90">{Number(profile.age)} años</p>
                </div>

                <div className="flex items-center gap-2">
                  <LevelStars level={profile.level} />
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    {positionToSpanish(profile.position)}
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm">
                    <MapPin className="h-3 w-3 mr-1" />
                    {profile.zone}
                  </Badge>
                </div>
              </div>
            </div>

            <CardContent className="p-6">
              <div className="space-y-4">
                {profile.bio && (
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground mb-2">Sobre mí</h3>
                    <p className="text-sm">{profile.bio}</p>
                  </div>
                )}

                {profile.availability.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground mb-2">Disponibilidad</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.availability.map((slot, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {slot}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-4 text-sm text-muted-foreground">
                  <div>
                    <span className="font-semibold text-foreground">{Number(profile.matchesPlayed)}</span> partidos
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">{Number(profile.wins)}</span> victorias
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
