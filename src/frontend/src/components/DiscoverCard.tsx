import { Profile } from '../backend';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import UserAvatar from './UserAvatar';
import CategoryBadge from './CategoryBadge';
import { positionToSpanish } from '../utils/profileMappings';
import { MapPin } from 'lucide-react';

interface DiscoverCardProps {
  profile: Profile;
}

export default function DiscoverCard({ profile }: DiscoverCardProps) {
  return (
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
            <CategoryBadge category={profile.category} />
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
  );
}
