import { useGetMatches, useGetUserProfile } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import UserAvatar from '../components/UserAvatar';
import { MessageCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { Principal } from '@dfinity/principal';

interface MatchesScreenProps {
  onOpenChat: (recipientId: Principal) => void;
  onOpenProfile: (userId: Principal) => void;
}

export default function MatchesScreen({ onOpenChat, onOpenProfile }: MatchesScreenProps) {
  const { identity } = useInternetIdentity();
  const { data: matches = [], isLoading } = useGetMatches();

  const myPrincipal = identity?.getPrincipal().toString();

  return (
    <div className="container max-w-2xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-emerald-700 dark:text-emerald-400">
          Mis Matches
        </h1>
        <p className="text-sm text-muted-foreground">
          {matches.length} {matches.length === 1 ? 'match' : 'matches'}
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando matches...</p>
        </div>
      ) : matches.length === 0 ? (
        <div className="text-center py-12 space-y-2">
          <p className="text-xl text-muted-foreground">No tienes matches todavía</p>
          <p className="text-sm text-muted-foreground">
            ¡Empieza a deslizar para encontrar compañeros!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {matches.map((match) => {
            const otherUserId =
              match.user1.toString() === myPrincipal ? match.user2 : match.user1;
            return (
              <MatchCard 
                key={match.createdAt.toString()} 
                userId={otherUserId} 
                onOpenChat={onOpenChat}
                onOpenProfile={onOpenProfile}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

function MatchCard({ 
  userId, 
  onOpenChat, 
  onOpenProfile 
}: { 
  userId: Principal; 
  onOpenChat: (id: Principal) => void;
  onOpenProfile: (id: Principal) => void;
}) {
  const { data: profile, isLoading, error, refetch } = useGetUserProfile(userId);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive/50">
        <CardContent className="p-4">
          <Alert variant="destructive" className="border-0">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span className="text-sm">Error al cargar perfil del match</span>
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
        </CardContent>
      </Card>
    );
  }

  if (!profile) {
    return (
      <Card className="border-muted">
        <CardContent className="p-4">
          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <p className="text-sm">Perfil no disponible</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full overflow-hidden flex-shrink-0">
            <UserAvatar photo={profile.photo} name={profile.name} />
          </div>
          <button
            onClick={() => onOpenProfile(userId)}
            className="flex-1 min-w-0 text-left hover:opacity-80 transition-opacity"
          >
            <h3 className="font-semibold text-lg truncate">{profile.name}</h3>
            <p className="text-sm text-muted-foreground">
              {Number(profile.age)} años • {profile.zone}
            </p>
          </button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChat(userId)}
            className="flex-shrink-0 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
